from django.conf.urls import url
from . import views

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users', views.UserViewSet, base_name='users')
router.register(r'perspectives', views.PerspectiveViewSet, base_name='perspectives')
urlpatterns = router.urls

'''urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^users/', views.UserList.as_view()),
    url(r'^userDetails/(?P<pk>[0-9]+)/$', views.UserDetail.as_view()),
    url(r'^stock/', views.StockList.as_view()),
    url(r'^stock/(?P<pk>[-\w]+)/$', views.StockDetail.as_view()),
    url(r'^stockDetails/(?P<pk>[-\w]+)/$', views.StockDetail.as_view()),
    url(r'^perspectives/', views.PerspectivesList.as_view()),
    url(r'^perspectiveDetails/(?P<pk>[-\w]+)/$', views.PerspectiveDetail.as_view()),
]'''