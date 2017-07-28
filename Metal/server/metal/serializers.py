# ******************************************************************************
#
#   File:   serializers.py
#   Rev:    a-2
#   Date:   07/28/2017
#
#   Developed for the U.S. Government under contract(s):
#           HR001117C0099
#
# ******************************************************************************
#
#   Serializer definitions that define the serializable fields for models
#
# ******************************************************************************
#
#   Modification Log:
#
#   a-1:    07/14/2017  pcharasala
#           : Initial version
#   a-2:    07/28/2017  cstarkey
#	    : Added map data serializer tree
#           : Added risk areas
#
# ******************************************************************************

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Perspective
from .models import Scenario
from .models import Asset
from .models import AssetResource
from .models import Resource
from .models import Site
from .models import Route
from .models import RouteSegment
from .models import AssetRouteAssignment
from .models import RiskType
from .models import RiskArea
from .models import RiskAreaVertex
from .models import TimeToFailureDistribution


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')


class PerspectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perspective
        fields = ('id', 'jsondata', 'userid')


class ScenarioSerializer(serializers.ModelSerializer):
    resources = serializers.StringRelatedField(many=True)
    sites = serializers.StringRelatedField(many=True)

    class Meta:
        model = Scenario
        fields = ('name', 'file_name', 'json_file', 'date_modified', 'resources', 'sites')

#resources
class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ('id', 'name')

#assets
class AssetResourceSerializer(serializers.ModelSerializer):
    resource = ResourceSerializer(many=False, read_only=True)
    class Meta:
        model = AssetResource
        fields = ('asset', 'resource', 'transport_capacity', 'consumption_capacity', 'contested_consumption',
                  'uncontested_consumption')

class AssetSerializer(serializers.ModelSerializer):
    asset_resources = AssetResourceSerializer(many=True, read_only=True)
    class Meta:
        model = Asset
        fields = ('id', 'name', 'speed', 'htmlcolor', 'asset_resources')

# sites
class SiteSerializer(serializers.ModelSerializer):
    asset = AssetSerializer(many=False, read_only=True)
    class Meta:
        model = Site
        fields = ('id', 'name', 'asset', 'latitude', 'longitude')

# routes
class RouteSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteSegment
        fields = ('id', 'route', 'start_latitude', 'start_longitude', 'end_latitude',
                  'end_longitude', 'distance')

class AssetRouteAssignmentSerializer(serializers.ModelSerializer):
    asset = AssetSerializer(many=False, read_only=True)
    class Meta:
        model = AssetRouteAssignment
        fields = ('asset', 'route', 'count', 'utilization')

class RouteSerializer(serializers.ModelSerializer):
    route_segments = RouteSegmentSerializer(many=True, read_only=True)
    asset_route_assignments = AssetRouteAssignmentSerializer(many=True, read_only=True)
    class Meta:
        model = Route
        fields = ('id', 'name', 'scenario', 'distance', 'route_segments', 'asset_route_assignments')

# risk areas
class RiskTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskType
        fields = ('id', 'name', 'htmlcolor')

class RiskAreaVertexSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiskAreaVertex
        fields = ('id', 'latitude', 'longitude')

class RiskAreaSerializer(serializers.ModelSerializer):
    risktype = RiskTypeSerializer(many=False, read_only=True)
    risk_area_verteces = RiskAreaVertexSerializer(many=True, read_only=True)
    class Meta:
        model = RiskArea
        fields = ('id', 'name', 'risktype', 'risk_area_verteces')

# map data
class MapDataSerializer(serializers.ModelSerializer):
    resources = ResourceSerializer(many=True, read_only=True)
    assets = AssetSerializer(many=True, read_only=True)
    sites = SiteSerializer(many=True, read_only=True)
    risk_areas = RiskAreaSerializer(many=True, read_only=True)
    routes = RouteSerializer(many=True, read_only=True)
    class Meta:
        model = Scenario
        fields = ('name', 'resources', 'assets', 'sites', 'risk_areas', 'routes')

# time to failure
class TimeToFailureDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeToFailureDistribution
        fields = ('scenario', 'key', 'data', 'x_axis_label', 'y_axis_label')

