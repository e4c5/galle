from rest_framework import status, viewsets
from rest_framework.response import Response

from django.db.models import Q

from api import serializers
from pair.models import TournamentRound, RoundResult, Participant, Tournament, Player

class TournamentViewSet(viewsets.ModelViewSet):
    '''
    Handles the tournaments
    '''
    lookup_field = 'slug'
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.TournamentListSerializer
        
        return serializers.TournamentDetailSerializer
    
    def get_queryset(self):
        return Tournament.objects.prefetch_related('rounds').all()
        
        
    
    def create(self, request, *args, **kwargs):
        '''
        Create a new tournament from post data
        '''
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    
class ResultViewSet(viewsets.ModelViewSet):
    '''
    Handles displaying and updating results of a tournament
    '''
    serializer_class = serializers.ResultSerializer
    
    def get_queryset(self):
        tournament = self.kwargs['tournament']
        qs = RoundResult.objects.exclude(participant__player__full_name='Bye'
                ).filter(tournament_id=tournament
                ).select_related('participant','opponent','participant__player','opponent__player','game')
    
        rnd = self.request.query_params.get('round')
        if rnd:
            return qs.filter(game__round_no=rnd)
        
        player = self.request.query_params.get('participant')
        if player:
            return qs.filter(participant__id=player)
        return qs
    
    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        resp = super().update(request, *args, **kwargs)
        return resp
    
    
class ParticipantViewSet(viewsets.ModelViewSet):
    '''
    Handles the standings of a given tournament
    '''
    serializer_class = serializers.ParticipantSerializer
    
    def get_queryset(self):
        tournament = self.kwargs['tournament']
        return Participant.objects.select_related('player').filter(tournament_id=tournament).order_by('position')
