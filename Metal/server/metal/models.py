# ******************************************************************************
#
#   File:   models.py
#   Rev:    a-2
#   Date:   07/28/2017
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
#   a-2:    07/28/2017  cstarkey
#           : Added risk areas, colors and a serializer tag to AssetResource
#
# ******************************************************************************

# Django imports
from django.db import models


class Scenario(models.Model):
    name = models.CharField(max_length=30, primary_key=True)
    file_name = models.TextField()
    json_file = models.TextField()
    date_modified = models.FloatField()

    def __str__(self):
        return self.name


class Resource(models.Model):
    class Meta:
        unique_together = ('name', 'scenario')
    name = models.TextField()
    scenario = models.ForeignKey(Scenario, related_name='resources', default='default', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Asset(models.Model):
    class Meta:
        unique_together = ('name', 'scenario')
    name = models.TextField()
    scenario = models.ForeignKey(Scenario, related_name='assets', default='default', on_delete=models.CASCADE)
    speed = models.FloatField()
    htmlcolor = models.TextField(default='black')

    def __str__(self):
        return self.name


class AssetResource(models.Model):
    class Meta:
        unique_together = (('asset', 'resource'),)
        # https://stackoverflow.com/questions/28712848/composite-primary-key-in-django
    asset = models.ForeignKey(Asset, related_name='asset_resources', default='default', on_delete=models.CASCADE)
    resource = models.ForeignKey(Resource, related_name='asset_resources', default='default', on_delete=models.CASCADE)
    transport_capacity = models.FloatField()
    consumption_capacity = models.FloatField()
    contested_consumption = models.FloatField()
    uncontested_consumption = models.FloatField()

    def __str__(self):
        return self.asset.name + '->' + self.resource.name


class Site(models.Model):
    class Meta:
        unique_together = ('name', 'scenario')
    name = models.TextField()
    scenario = models.ForeignKey(Scenario, related_name='sites', default='default', on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, related_name='sites', default='default', on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.name


class Route(models.Model):
    class Meta:
        unique_together = ('name', 'scenario')
    scenario = models.ForeignKey(Scenario, related_name='routes', default='default', on_delete=models.CASCADE)
    name = models.TextField()
    distance = models.FloatField()

    def __str__(self):
        return self.name


class RouteSegment(models.Model):
    route = models.ForeignKey(Route, related_name='route_segments', default='default', on_delete=models.CASCADE)
    start_latitude = models.FloatField()
    start_longitude = models.FloatField()
    end_latitude = models.FloatField()
    end_longitude = models.FloatField()
    distance = models.FloatField()

    def __str__(self):
        return self.route.name + '- segment ' + str(self.id)


class AssetRouteAssignment(models.Model):
    scenario = models.ForeignKey(Scenario, related_name='asset_route_assignments', default='default', on_delete=models.CASCADE)
    asset = models.ForeignKey(Asset, related_name='asset_route_assignments', default='default', on_delete=models.CASCADE)
    route = models.ForeignKey(Route, related_name='asset_route_assignments', default='default', on_delete=models.CASCADE)
    count = models.IntegerField()
    utilization = models.FloatField()

    def __str__(self):
        return self.asset.name + '-' + self.route.name

class RiskType(models.Model):
    class Meta:
        unique_together = ('name', 'scenario')
    scenario = models.ForeignKey(Scenario, related_name='risk_types', default='default', on_delete=models.CASCADE)
    name = models.TextField()
    htmlcolor = models.TextField(default='white')

    def __str__(self):
        return self.name

class RiskArea(models.Model):
    class Meta:
        unique_together = ('name', 'scenario')
    scenario = models.ForeignKey(Scenario, related_name='risk_areas', default='default', on_delete=models.CASCADE)
    risktype = models.ForeignKey(RiskType, related_name='risk_areas', default='default', on_delete=models.CASCADE)
    name = models.TextField()

    def __str__(self):
        return self.name

class RiskAreaVertex(models.Model):
    riskarea = models.ForeignKey(RiskArea, related_name='risk_area_verteces', default='default', on_delete=models.CASCADE)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.riskarea.name + '- vertex ' + str(self.id)


class TimeToFailureDistribution(models.Model):
    scenario = models.OneToOneField(Scenario,
                                    on_delete=models.CASCADE, unique=True, primary_key=True)  # Primary and also Forien Key
    key = models.CharField(max_length=50)
    x_axis_label = models.CharField(max_length=30, default='default')
    y_axis_label = models.CharField(max_length=30, default='default')
    data = models.TextField()

    def __str__(self):
        return self.scenario.name + '->TimeToFailureDistribution'


class Perspective(models.Model):
    jsondata = models.TextField()
    userid = models.CharField(max_length=20)

    def __str__(self):
        return self.userid
