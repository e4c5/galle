from rest_framework.routers import DefaultRouter
from django.urls import path
from api import views

urlpatterns = [path('upload/', views.FileUploadView.as_view())]

router = DefaultRouter()
router.register(r'(?P<tournament>\d+)/results', views.ResultViewSet, basename='tournament')
router.register(r'(?P<tournament>\d+)/participant', views.ParticipantViewSet, basename='tournament')
router.register(r'player', views.PlayerViewSet, basename='player')
router.register(r'', views.TournamentViewSet, basename='tournament')

urlpatterns += router.urls