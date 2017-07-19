# ******************************************************************************
#
#   File:   metal/urls.py
#   Rev:    a-1
#   Date:   07/14/2017
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
router.register(r'time_to_failure_distributions', views.TimeToFailureDistributionViewSet,
                base_name='time_to_failure_distributions')

urlpatterns = [
    url(r'^$',views.index),
    url(r'run', views.run_model),
]

urlpatterns += router.urls
