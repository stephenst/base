# ******************************************************************************
#
#   File:   serializers.py
#   Rev:    a-1
#   Date:   07/14/2017
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
    time_to_failure_distributions = serializers.StringRelatedField(many=True)

    class Meta:
        model = Scenario
        fields = ('name', 'file_name', 'json_file', 'date_modified', 'resources', 'sites',
                  'time_to_failure_distributions')


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ('name', 'file_name', 'json_file', 'date_modified')


class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ('name', 'speed')


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ('name', 'scenario', 'asset', 'latitude', 'longitude')


class TimeToFailureDistributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeToFailureDistribution
        fields = ('scenario', 'key', 'data')


class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = ('name', 'scenario', 'distance')


class RouteSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RouteSegment
        fields = ('route', 'start_latitude', 'start_longitude', 'end_latitude', 'end_longitude', 'distance')


class AssetRouteAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetRouteAssignment
        fields = ('scenario', 'asset', 'route', 'count', 'utilization')


class AssetResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssetResource
        fields = ('asset', 'resource', 'transport_capacity', 'consumption_capacity', 'contested_consumption',
                  'uncontested_consumption')
