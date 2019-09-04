from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter
from api import views

router = DefaultRouter()
router.register(r'results/(?P<tournament>\d+)', views.ResultViewSet, base_name='tournament')
router.register(r'standings/(?P<tournament>\d+)', views.StandingsViewSet, base_name='tournament')
router.register(r'', views.TournamentViewSet, base_name='tournament')

urlpatterns = router.urls