from rest_framework.routers import DefaultRouter
from api import views

router = DefaultRouter()
router.register(r'(?P<tournament>\d+)/results', views.ResultViewSet, base_name='tournament')
router.register(r'(?P<tournament>\d+)/participant', views.ParticipantViewSet, base_name='tournament')
router.register(r'', views.TournamentViewSet, base_name='tournament')

urlpatterns = router.urls