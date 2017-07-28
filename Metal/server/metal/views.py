# ******************************************************************************
#
#   File:   metal/views.py
#   Rev:    a-2
#   Date:   07/28/2017
#
#   Developed for the U.S. Government under contract(s):
#           HR001117C0099
#
# ******************************************************************************
#
#   View set definitions for models
#
# ******************************************************************************
#
#   Modification Log:
#
#   a-1:    07/14/2017  pcharasala
#           : Initial version
#   a-2:    07/28/2017  cstarkey
#           : Added risk areas, colors and map data
#
# ******************************************************************************

from django.http import HttpResponse
from django.contrib.auth.models import User
from django.http import Http404
from rest_framework.decorators import detail_route
from corsheaders import defaults

from .serializers import ScenarioSerializer
from .serializers import SiteSerializer
from .serializers import ResourceSerializer
from .serializers import AssetSerializer
from .serializers import AssetResourceSerializer
from .serializers import RouteSerializer
from .serializers import RouteSegmentSerializer
from .serializers import AssetRouteAssignmentSerializer
from .serializers import RiskTypeSerializer
from .serializers import RiskAreaSerializer
from .serializers import RiskAreaVertexSerializer
from .serializers import MapDataSerializer
from .serializers import TimeToFailureDistributionSerializer

from rest_framework import status
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Asset
from .models import AssetResource
from .models import AssetRouteAssignment
from .models import Perspective
from .models import Resource
from .models import Route
from .models import RouteSegment
from .models import Scenario
from .models import Site
from .models import RiskType
from .models import RiskArea
from .models import RiskAreaVertex
from .models import TimeToFailureDistribution
from .serializers import PerspectiveSerializer
from .serializers import UserSerializer


def index(request):

    return build_scenarios()


def build_scenarios():

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
                    found_in_database = True
                    if file_modified_time > scenario.date_modified:
                        # The file is more recent than the database entry
                        scenario.date_modified = file_modified_time
                        json_string = open(fullfilename, 'r').read()
                        scenario.json_file = json_string
                        data = json.loads(json_string)
                        scenario.name = data["name"]
                        scenario.file_name = fullfilename
                        scenario.save()
                        break

            if not found_in_database:
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


def run_model(scenario_key):

    import json
    import json_to_model_system as gda_json
    import analyze_lp as gda_lp

    scenario = Scenario.objects.filter(name=scenario_key).first()
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

    routes_to_delete = Route.objects.filter(scenario=scenario)
    for route in routes_to_delete:
        route_segments_to_delete = RouteSegment.objects.filter(route=route)
        for route_segment in route_segments_to_delete:
            route_segment.delete()
        route.delete()

    asset_route_assignments_to_delete = AssetRouteAssignment.objects.filter(scenario=scenario)
    for asset_route_assignment in asset_route_assignments_to_delete:
        asset_route_assignment.delete()

    risktypes_to_delete = RiskType.objects.filter(scenario=scenario)
    for risktype in risktypes_to_delete:
        risktype.delete()

    riskareas_to_delete = RiskArea.objects.filter(scenario=scenario)
    for riskarea in riskareas_to_delete:
        riskareavertex_to_delete = RiskAreaVertex.objects.filter(riskarea=riskarea)
        for riskareavertex in riskareavertex_to_delete:
            riskareavertex.delete()
        riskarea.delete()

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
                      htmlcolor=(asset_dict['attributes']).get('htmlcolor','black'),
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
        asset = Asset.objects.filter(name=(site_dict['needed_asset_types'])[0], scenario=scenario)
        site = Site(name=site_dict['name'],
                    scenario=scenario,
                    asset=asset[0],
                    latitude=(site_dict['location'])[0],
                    longitude=(site_dict['location'])[1])
        site.save()

    risktype_dict = dict()
    risk_raw = scenario_pnode.get('risktypes', [])
    for risk_dict in risk_raw:
        risktype_name = risk_dict['name']
        risktype = RiskType(name=risktype_name,
                      htmlcolor=risk_dict.get('htmlcolor','white'),
                      scenario=scenario)
        risktype.save()
        risktype_dict[risktype_name] = risktype

    riskarea_raw = scenario_pnode.get('riskareas', [])
    for riskarea_dict in riskarea_raw:
        risktype_name = riskarea_dict['risktype']
        risktype = risktype_dict[risktype_name]
        riskarea = RiskArea(name=riskarea_dict['name'],
                      risktype=risktype,
                      scenario=scenario)
        riskarea.save()
        for vertex_array in riskarea_dict['region']:
            riskareavertex = RiskAreaVertex(riskarea=riskarea,
			    	latitude=vertex_array[0],
			    	longitude=vertex_array[1])
            riskareavertex.save()

    # budget_raw = scenario_pnode['budget']
    # composites_raw = scenario_pnode['composite_relations']
    # services_raw = scenario_pnode['service_relations']

    # Call GDA function to create model system
    model_system, model_route = gda_json.json_to_model_system(scenario.json_file)

    # Create the model route and route segment tables
    for route_dict in model_route.routes:
        route = Route(scenario=scenario,
                      name=route_dict['name'],
                      distance=route_dict['total_dist'])
        route.save()

        for segment_dict in route_dict['segments']:
            start_site = Site.objects.filter(name=segment_dict['points'][0])
            end_site = Site.objects.filter(name=segment_dict['points'][1])
            segment = RouteSegment(route=route,
                                   start_latitude=start_site[0].latitude,
                                   start_longitude=start_site[0].longitude,
                                   end_latitude=end_site[0].latitude,
                                   end_longitude=end_site[0].longitude,
                                   distance=segment_dict['dist'])
            segment.save()

    print("Beginning Run of LP for ", scenario.name)
    # Construct LP from model system and model routes
    gda_lp.assemble_problem(model_system, model_route)

    # Solve LP
    result = gda_lp.solve_LP_per_route(model_system, model_route)
    print("Completed Run of LP for ", scenario.name)

    composite_asset_list = model_system.assets
    comp_asset_based_results = result.lp_res_counts_df
    for df_index, row in comp_asset_based_results.iterrows():
        if row['count'] > 0:
            composite_asset_name = df_index[0]
            route_name = df_index[1]
            for comp_asset in composite_asset_list:
                if comp_asset.symbol_composite == composite_asset_name:
                    for asset_name in comp_asset.contains:
                        asset_list = Asset.objects.filter(scenario=scenario, name=asset_name)
                        route_list = Route.objects.filter(scenario=scenario, name=route_name)

                        asset_route_assign = AssetRouteAssignment(scenario=scenario,
                                                                  asset=asset_list[0],
                                                                  route=route_list[0],
                                                                  count=row['count'],
                                                                  utilization=row['utilization'])
                        asset_route_assign.save()
                    break

    print("Completed Asset Route Assignment writing for ", scenario.name)
    # FIXME - add a fake time to failure distribution until the model is updated
    data = "[{"
    import numpy as np
    s = np.random.normal(6, 1.5, 1000)
    counts, edges = np.histogram(s, bins=10)
    for day in range(1,11):
        data += "\"label\": \" " + str(day) + "\", \"value\":\" " + str((counts[day - 1]/1000))
        if day == 10:
            data += "\"}"
        else:
            data += "\"},{"
    data += "]"

    ttfdist = TimeToFailureDistribution(scenario=scenario,
                                        key=(scenario.name + "- Time to Failure Distribution"),
                                        x_axis_label='Days to Failure',
                                        y_axis_label='Probability',
                                        data=data)
    ttfdist.save()
    print("Completed building Time to failure distribution for ", scenario.name)
    print("Data = ", data)
    # print_database()

    #return HttpResponse(result)


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
            print("\t\tAsset:", site.asset.name)

        asset_list = Asset.objects.filter(scenario=scenario)
        for asset in asset_list:
            print("\tAsset: ", asset.name)
            print("\t\tSpeed: ", asset.speed)
            for resource in resource_list:
                asset_resource_list = AssetResource.objects.filter(asset=asset, resource=resource)
                print("\t\tResource:", resource.name)
                for asset_resource in asset_resource_list:
                    print("\t\t\tConsumption Capacity:", asset_resource.consumption_capacity)
                    print("\t\t\tTransport Capacity:", asset_resource.transport_capacity)
                    print("\t\t\tContested Consumption:", asset_resource.consumption_capacity)
                    print("\t\t\tUncontested Consumption:", asset_resource.uncontested_consumption)

        print("\tRoutes:")
        route_list = Route.objects.filter(scenario=scenario)
        for route in route_list:
            print("\t\tName:", route.name)
            print("\t\tDistance:", route.distance)
            print("\t\tSegments:")
            segment_list = RouteSegment.objects.filter(route=route)
            for segment in segment_list:
                print("\t\t\tStart Latitude:", segment.start_latitude)
                print("\t\t\tStart Longitude:", segment.start_longitude)
                print("\t\t\tEnd Latitude:", segment.end_latitude)
                print("\t\t\tEnd Longitude:", segment.end_longitude)

        asset_route_assign_list = AssetRouteAssignment.objects.filter(scenario=scenario)
        print("\tAsset Route Assignment")
        for asset_route_assign in asset_route_assign_list:
            print("\t\tAsset:", asset_route_assign.asset.name)
            print("\t\tRoute:", asset_route_assign.route.name)
            print("\t\tCount:", asset_route_assign.count)

        print("\tRiskAreas:")
        riskarea_list = RiskArea.objects.filter(scenario=scenario)
        for riskarea in riskarea_list:
            print("\t\tName:", riskarea.name)
            print("\t\tRisk Type:", riskarea.risktype.name)
            print("\t\tVerteces:")
            vertex_list = RiskAreaVertex.objects.filter(riskarea=riskarea)
            for vertex in vertex_list:
                print("\t\t\tLatitude:", vertex.latitude)
                print("\t\t\tLongitude:", vertex.longitude)

        dist_list = TimeToFailureDistribution.objects.filter(scenario=scenario)
        for dist in dist_list:
            print("\tDistribution:")
            print("\t\tKey:", dist.key)
            print("\t\tX-Axis Label:", dist.x_axis_label)
            print("\t\tY-Axis Label:", dist.y_axis_label)
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


class ScenarioViewSet(viewsets.ModelViewSet):
    build_scenarios()
    serializer_class = ScenarioSerializer
    queryset = Scenario.objects.all()

    @detail_route(methods=['get'], url_path='run_model')
    def run_model(self, request, pk=None):
        scenario = Scenario.objects.filter(name=pk).first()
        if(scenario != None):
            return run_model(scenario)
        response = HttpResponse({})
        response['Access-Control-Allow-Origin'] = 'http://localhost:8091'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        return response

    @detail_route(methods=['get'], url_path='routes')
    def get_routes(self, request, pk=None):
        routes = Route.objects.filter(scenario=pk)
        serializer = RouteSerializer(routes, many=True)
        response = Response(serializer.data, status=status.HTTP_200_OK)
        response['Access-Control-Allow-Origin'] = 'http://localhost:8091'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
        return response


class ScenarioVewSet2(viewsets.ViewSet):
    """
    Viewset that calls index view too
    """
    def list(selfself, request):
        index(request)
        queryset = Scenario.objects.all()
        serializer = ScenarioSerializer(queryset, many=True)
        return Response(serializer.data)


class ResourceViewSet(viewsets.ModelViewSet):
    serializer_class = ResourceSerializer
    queryset = Resource.objects.all()


class SiteViewSet(viewsets.ModelViewSet):
    serializer_class = SiteSerializer
    queryset = Site.objects.all()


class AssetViewSet(viewsets.ModelViewSet):
    serializer_class = AssetSerializer
    queryset = Asset.objects.all()


class AssetResourceViewSet(viewsets.ModelViewSet):
    serializer_class = AssetResourceSerializer
    queryset = AssetResource.objects.all()


class RouteViewSet(viewsets.ModelViewSet):
    serializer_class = RouteSerializer
    queryset = Route.objects.all()


class RouteSegmentViewSet(viewsets.ModelViewSet):
    serializer_class = RouteSegmentSerializer
    queryset = RouteSegment.objects.all()


class AssetRouteAssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssetRouteAssignmentSerializer
    queryset = AssetRouteAssignment.objects.all()

class RiskTypeViewSet(viewsets.ModelViewSet):
    serializer_class = RiskTypeSerializer
    queryset = RiskType.objects.all()

class RiskAreaViewSet(viewsets.ModelViewSet):
    serializer_class = RiskAreaSerializer
    queryset = RiskArea.objects.all()

class RiskAreaVertexViewSet(viewsets.ModelViewSet):
    serializer_class = RiskAreaVertexSerializer
    queryset = RiskAreaVertex.objects.all()

class MapViewSet(viewsets.ModelViewSet):
    serializer_class = MapDataSerializer
    queryset = Scenario.objects.all()

class TimeToFailureDistributionViewSet(viewsets.ModelViewSet):
    serializer_class = TimeToFailureDistributionSerializer
    queryset = TimeToFailureDistribution.objects.all()

    def get_object(self):
        if self.action == 'retrieve':
            scenario = self.kwargs['pk']
            run_model(scenario)
        return super().get_object()
