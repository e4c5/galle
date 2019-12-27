from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from pair.models import Tournament, Participant, TournamentRound

class BasicTests(APITestCase):
        
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        
        TournamentRound.objects.all().delete()
        Participant.objects.all().delete()
        Tournament.objects.all().delete()
        
       
      
    def test_create(self):
        simple = {"start_date":"2019-12-27",
                  "rounds":[{"based_on":0,"round_no":1,"pairing_system":"SWISS","spread_cap":1000},
                            {"based_on":1,"round_no":2,"pairing_system":"SWISS","spread_cap":1000},
                            {"based_on":2,"round_no":3,"pairing_system":"SWISS","spread_cap":1000},],
                  "name":"3round","rated":"1"}
        
        
        response = self.client.post('/api/', simple, 'json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)