# ******************************************************************************
#
#   File:   models.py
#   Rev:    a-1
#   Date:   07/12/2017
#
#   Developed for the U.S. Government under contract(s):
#           HR001117C0099
#
# ******************************************************************************
#
#   Class definitions defining the tables in the django database
#
# ******************************************************************************
#
#   Modification Log:
#
#   a-1:    07/12/2017  mcosgrove
#           : Initial version
#
# ******************************************************************************

# Django imports
from django.db import models


class Stock(models.Model):
    ticker = models.CharField(max_length=10)
    open = models.FloatField()
    close = models.FloatField()
    volume = models.IntegerField()

    def __str__(self):
        return self.ticker


class Scenario(models.Model):
    scenario_name = models.CharField(max_length=30)
    scenario_json_file = models.TextField()
    date_modified = models.FloatField()

    def __str__(self):
        return self.scenario_name


class Resource(models.Model):
    resource_name = models.CharField(max_length=30)
    scenario_name = models.CharField(max_length=30)

    def __str__(self):
        return self.resource_name


class Site(models.Model):
    site_name = models.CharField(max_length=30)
    scenario_name = models.CharField(max_length=30)
    site_asset_name = models.CharField(max_length=30)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.site_name


class AssetResource(models.Model):
    asset_name = models.CharField(max_length=30)
    resource_name = models.CharField(max_length=30)
    transport_capacity = models.FloatField()
    consumption_capacity = models.FloatField()
    contested_consumption = models.FloatField()
    uncontested_consumption = models.FloatField()

    def __str__(self):
        return self.asset_name + '->' + self.resource_name


class Asset(models.Model):
    asset_name = models.CharField(max_length=30)
    speed = models.FloatField()

    def __str__(self):
        return self.asset_name


class TimeToFailureDistribution(models.Model):
    scenario_name = models.CharField(max_length=30)
    key = models.CharField(max_length=50)
    data = models.CharField(max_length=200)

    def __str__(self):
        return self.scenario_name + '->TimeToFailureDistribution'


class Perspective(models.Model):
    jsondata = models.TextField()
    userid = models.CharField(max_length=20)

    def __str__(self):
        return self.userid
