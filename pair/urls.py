"""r URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from rest_framework.routers import DefaultRouter
from pair import views
router = DefaultRouter()
router.register(r'results/(?P<tournament>\d+)', views.ResultViewSet, base_name='tournament')
router.register(r'standings/(?P<tournament>\d+)', views.StandingsViewSet, base_name='tournament')
router.register(r'', views.TournamentViewSet, base_name='tournament')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('tournament/<slug:slug>/', views.tournament),
    path('api/', include(router.urls)),
    path('', views.home),
    path('start/', views.start),
    path('import/', views.import_tsh),
    path('start/<slug:slug>/', views.start),
]
