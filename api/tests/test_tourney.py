from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase

from pair.models import Tournament, Participant, TournamentRound, Player

class BasicTests(APITestCase):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
                
        self.player = {
            "full_name": "Hayati Rassool",
            "country": "SL",
            "slug": "hayati-rassool",
            "wespa_rating": None,
            "national_rating": 948
        }
        
        self.simple = {"start_date":"2019-12-27",
                  "rounds":[{"based_on":0,"round_no":1,"pairing_system":"SWISS","spread_cap":1000},
                            {"based_on":1,"round_no":2,"pairing_system":"SWISS","spread_cap":1000},
                            {"based_on":2,"round_no":3,"pairing_system":"SWISS","spread_cap":1000},],
                  "name":"3round","rated":"1"}
        
                
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        
        TournamentRound.objects.all().delete()
        Participant.objects.all().delete()
        Tournament.objects.all().delete()

      
    def test_create(self):
        '''
        Test create new tournament
        '''
        
        response = self.client.post('/api/', self.simple, 'json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['num_rounds'], 3)
        self.assertEqual(response.data['current_round'], 0)
        self.assertEqual(len(response.data['rounds']), 3)
        
        response = self.client.get('/api/3round/',format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['rounds']), 3)
        
        
    def test_add_participant_no_player(self):
        '''
        Add a first time player as a Participant
        '''
        response = self.client.post('/api/', self.simple, 'json')
        response = self.client.post('/api/{0}/participant/'.format(response.data['id']), {'player_id': 10}, 'json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        
    def test_add_player(self):
        response = self.client.post('/api/player/',self.player, 'json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Player.objects.count(), 1)
        
        
    def test_add_participant(self):
        self.client.post('/api/player/',self.player, 'json')
        self.client.post('/api/', self.simple, 'json')
        response = self.client.post('/api/{0}/participant/'.format(Tournament.objects.all()[0].id),
                                    {'player_id': Player.objects.all()[0].id}, 'json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.player['full_name'], response.data['player']['full_name'])