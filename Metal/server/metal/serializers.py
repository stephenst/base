from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Stock
from .models import Perspective


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')


class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ('ticker', 'open', 'close', 'volume')


class PerspectiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Perspective
        fields = ('id', 'jsondata', 'userid')

