from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Perspective


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')


class PerspectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perspective
        fields = ('id', 'jsondata', 'userid')

