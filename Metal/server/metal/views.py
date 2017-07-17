# ******************************************************************************
#
#   File:   metal/views.py
#   Rev:    a-1
#   Date:   07/14/2017
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
#
# ******************************************************************************

from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.http import Http404
from .models import Perspective
from .models import Scenario
from .models import Site
from .models import Resource
from .models import Asset
from .models import AssetResource
from .models import TimeToFailureDistribution


from .serializers import UserSerializer
from .serializers import PerspectiveSerializer
from .serializers import ScenarioSerializer
from .serializers import SiteSerializer
from .serializers import ResourceSerializer
from .serializers import AssetSerializer
from .serializers import AssetResourceSerializer
from .serializers import TimeToFailureDistributionSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from django.shortcuts import get_object_or_404


def index(request):
    return HttpResponse("Hello, world. You're at the Metal index page.")


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
    serializer_class = ScenarioSerializer
    queryset = Scenario.objects.all()


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


class TimeToFailureDistributionViewSet(viewsets.ModelViewSet):
    serializer_class = TimeToFailureDistributionSerializer
    queryset = TimeToFailureDistribution.objects.all()
