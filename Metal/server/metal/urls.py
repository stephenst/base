from django.conf.urls import url
from . import views

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', views.UserViewSet, base_name='users')
router.register(r'perspectives', views.PerspectiveViewSet, base_name='perspectives')
urlpatterns = router.urls
