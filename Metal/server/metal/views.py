from django.contrib.auth.models import User
from django.http import Http404
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Asset
from .models import AssetResource
from .models import Perspective
from .models import Resource
from .models import Scenario
from .models import Site
from .models import TimeToFailureDistribution
from .serializers import PerspectiveSerializer
from .serializers import UserSerializer


def index(request):

    import os
    import json

    scenario_dir = os.path.expanduser("~/metal_scenarios")
    # Get the list of scenarios in the database
    scenario_list = Scenario.objects.all()

    # Return list of directories in the scenario directory
    scenario_files = os.listdir(scenario_dir)
    for file in scenario_files:
        if file.endswith(".json"):
            # This file is a potential scenario file, see if it has been previously loaded
            fullfilename = os.path.join(scenario_dir, file)

            file_modified_time = os.path.getmtime(fullfilename)
            found_in_database = False
            for scenario in scenario_list:
                if scenario.file_name == fullfilename:
                    print("Scenario found in database")
                    found_in_database = True
                    if file_modified_time > scenario.date_modified:
                        # The file is more recent than the database entry
                        print("Data file is newer than database entry")
                        scenario.date_modified = file_modified_time
                        json_string = open(fullfilename, 'r').read()
                        scenario.json_file = json_string
                        data = json.loads(json_string)
                        scenario.name = data["name"]
                        scenario.file_name = fullfilename
                        scenario.save()
                        break

            if not found_in_database:
                print("This is a new file")
                json_string = open(fullfilename, 'r').read()
                data = json.loads(json_string)
                scenario = Scenario(name=data["name"],
                                    json_file=json_string,
                                    file_name=fullfilename,
                                    date_modified=file_modified_time)
                scenario.save()

    scenario_list = Scenario.objects.all()
    outstring = ""
    for scenario in scenario_list:
        outstring += scenario.name + ", " + scenario.file_name + ', ' + str(scenario.date_modified) + '\n'

    return HttpResponse(outstring)


def run_model(request):

    import json
    import json_to_model_system as gda_json
    import analyze_lp as gda_lp

    # Get the first scenario from the database
    scenario_list = Scenario.objects.all()
    scenario = scenario_list[0]

    # Delete all records associated with this scenario
    resources_to_delete = Resource.objects.filter(scenario=scenario)
    assets_to_delete = Asset.objects.filter(scenario=scenario)
    for resource in resources_to_delete:
        for asset in assets_to_delete:
            asset_resources_to_delete = AssetResource.objects.filter(asset=asset, resource=resource)
            for asset_resource in asset_resources_to_delete:
                asset_resource.delete()
        resource.delete()

    for asset in assets_to_delete:
        asset.delete()

    site_to_delete = Site.objects.filter(scenario=scenario)
    for site in site_to_delete:
        site.delete()

    ttfdist_to_delete = TimeToFailureDistribution.objects.filter(scenario=scenario)
    for ttfdist in ttfdist_to_delete:
        ttfdist.delete()

    # Break up the input file into it's components to be written for display
    scenario_pnode = json.loads(scenario.json_file)

    # Write scenario details to the database -- start by determining the resources that are played
    resources_found = dict()
    assets_raw = scenario_pnode['assets']
    for asset_dict in assets_raw:
        asset = Asset(name=asset_dict['name'],
                      speed=(asset_dict['attributes'])['max_speed'],
                      scenario=scenario)
        asset.save()
        resource_dict = (asset_dict['attributes'])['resources']
        for resource_name, resource_def in resource_dict.items():
            if resource_name not in resources_found:
                resource = Resource(name=resource_name,
                                    scenario=scenario)
                resource.save()
                resources_found[resource_name] = resource
            else:
                resource = resources_found[resource_name]

            transport_capacity = 0.0
            if isinstance(resource_def['capacity'], dict):
                consumption_capacity = (resource_def['capacity'])['bunker']
                transport_capacity = (resource_def['capacity'])['deliverable']
            else:
                consumption_capacity = resource_def['capacity']

            contested_consumption = 0.0
            uncontested_consumption = 0.0
            if 'consumption' in resource_def.keys():
                contested_consumption = (resource_def['consumption'])['contested']
                uncontested_consumption = (resource_def['consumption'])['uncontested']

            asset_resource = AssetResource(asset=asset,
                                           resource=resource,
                                           transport_capacity=transport_capacity,
                                           consumption_capacity=consumption_capacity,
                                           contested_consumption=contested_consumption,
                                           uncontested_consumption=uncontested_consumption)
            asset_resource.save()

    sites_raw = scenario_pnode['sites']
    for site_dict in sites_raw:
        # FIXME - Note the input file permits multiple assets per site but now we are only taking one
        asset = Asset.objects.filter(name=(site_dict['needed_asset_types'])[0])
        site  = Site(name=site_dict['name'],
                     scenario=scenario,
                     asset=asset[0],
                     latitude=(site_dict['location'])[0],
                     longitude=(site_dict['location'])[1])
        site.save()

    # budget_raw = scenario_pnode['budget']
    # composites_raw = scenario_pnode['composite_relations']
    # services_raw = scenario_pnode['service_relations']

    # Call GDA function to create model system
    model_system, model_route = gda_json.json_to_model_system(scenario.json_file)

    # Construct LP from model system and model routes
    gda_lp.assemble_problem(model_system, model_route)

    # Solve LP
    result = gda_lp.solve_LP_per_route(model_system, model_route)

    # FIXME - add a fake time to failure distribution until the model is updated
    ttfdist = TimeToFailureDistribution(scenario=scenario,
                                        key=(scenario.name + "- Time to Failure Distribution"),
                                        data='[{"label":"1", "value","0.0"},{"label":"2", "value","0.0"},{"label":"3", "value","0.0"},{"label":"4", "value","0.1"},{"label":"5", "value","0.15"},{"label":"6", "value","0.3"},{"label":"7", "value","0.25"},{"label":"8", "value","0.15"},{"label":"9", "value","0.05"},{"label":"10", "value","0.0"}]')
    ttfdist.save()

    print_database()

    return HttpResponse(result)


def print_database():

    # Print Scenario Database
    scenario_list = Scenario.objects.all()
    for scenario in scenario_list:
        print("Scenario: ", scenario.name)
        print("\tFilename: ", scenario.file_name)
        print("\tModified Date: ", scenario.date_modified)

        resource_list = Resource.objects.filter(scenario=scenario)
        print("\tResources:")
        for resource in resource_list:
            print("\t\t", resource.name)

        site_list = Site.objects.filter(scenario=scenario)
        for site in site_list:
            print("\tSite: ", site.name)
            print("\t\tLocation: ", site.latitude, ", ", site.longitude)
            print("\t\tAsset:", (site.asset).name)

        asset_list = Asset.objects.filter(scenario=scenario)
        for asset in asset_list:
            print("\tAsset: ", asset.name)
            print("\t\tSpeed: ", asset.speed)
            for resource in resource_list:
                asset_resource_list = AssetResource.objects.filter(asset=asset, resource=resource)
                print("\t\tResource:")
                for asset_resource in asset_resource_list:
                    print("\t\t\tConsumption Capacity:", asset_resource.consumption_capacity)
                    print("\t\t\tTransport Capacity:", asset_resource.transport_capacity)
                    print("\t\t\tContested Consumption:", asset_resource.consumption_capacity)
                    print("\t\t\tUncontested Consumption:", asset_resource.uncontested_consumption)

        dist_list = TimeToFailureDistribution.objects.filter(scenario=scenario)
        for dist in dist_list:
            print("\tDistribution:")
            print("\t\tKey:", dist.key)
            print("\t\tData:", dist.data)



class UserViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for listing or retrieving users.
    """
    def list(self, request):
        queryset = User.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = User.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class UserList(APIView):
    """
        List all users, or create a new user.
    """
    def get(self, request, format=None):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = UserSerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserDetail(APIView):
    """
    Retrieve, update or delete a user instance.
    """
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        user = self.get_object(pk)
        user = UserSerializer(user)
        return Response(user.data)

    def put(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = UserSerializer(user, data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PerspectivesList(APIView):
    """
        List all perspectives, or create a new perspective.
    """
    def get(self, request, format=None):
        perspectives = Perspective.objects.all()
        serializer = PerspectiveSerializer(perspectives, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = PerspectiveSerializer(data=request.DATA)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        perspective = self.get_object(pk)
        perspective.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class PerspectiveViewSet(viewsets.ModelViewSet):
    serializer_class = PerspectiveSerializer
    queryset = Perspective.objects.all()
