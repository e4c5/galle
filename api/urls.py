from rest_framework.routers import DefaultRouter
from django.urls import path
from api import views

urlpatterns = [path('upload/', views.FileUploadView.as_view())]

router = DefaultRouter()
router.register(r'(?P<tournament>\d+)/results', views.ResultViewSet, base_name='tournament')
router.register(r'(?P<tournament>\d+)/participant', views.ParticipantViewSet, base_name='tournament')
router.register(r'player', views.PlayerViewSet, base_name='player')
router.register(r'', views.TournamentViewSet, base_name='tournament')

urlpatterns += router.urls