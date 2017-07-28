# ******************************************************************************
#
#   File:   metal/urls.py
#   Rev:    a-2
#   Date:   07/28/2017
#
#   Developed for the U.S. Government under contract(s):
#           HR001117C0099
#
# ******************************************************************************
#
#   URL route definitions for view sets
#
# ******************************************************************************
#
#   Modification Log:
#
#   a-1:    07/14/2017  pcharasala
#           : Initial version
#   a-2:    07/28/2017  cstarkey
#           : Added risk areas, sites and map data tree
#
# ******************************************************************************

from django.conf.urls import url
from . import views

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', views.UserViewSet, base_name='users')
router.register(r'perspectives', views.PerspectiveViewSet, base_name='perspectives')
router.register(r'scenarios', views.ScenarioViewSet, base_name='scenarios')
router.register(r'resources', views.ResourceViewSet, base_name='resources')
router.register(r'assets', views.AssetViewSet, base_name='assets')
router.register(r'sites', views.SiteViewSet, base_name='sites')
router.register(r'routes', views.RouteViewSet, base_name='routes')
router.register(r'routesegments', views.RouteSegmentViewSet, base_name='routesegments')
router.register(r'assetrouteassignments', views.AssetRouteAssignmentViewSet, base_name='assetrouteassignments')
router.register(r'risktypes', views.RiskTypeViewSet, base_name='risktypes')
router.register(r'riskareas', views.RiskAreaViewSet, base_name='riskareas')
router.register(r'riskareaverteces', views.RiskAreaVertexViewSet, base_name='riskareaverteces')
router.register(r'mapdata', views.MapViewSet, base_name='mapdata')
router.register(r'time_to_failure_distributions', views.TimeToFailureDistributionViewSet,
                base_name='time_to_failure_distributions')

urlpatterns = [
    url(r'^$',views.index),
    #url(r'run', views.run_model),
]


urlpatterns += router.urls
