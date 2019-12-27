from rest_framework import status, viewsets, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser

from django.db.models import Q

from api import serializers
from pair.models import TournamentRound, RoundResult, Participant, Tournament, Player
from tools import tsh_to_json

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
    

class PlayerViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.PlayerSerializer
    
    def get_queryset(self):
        if self.action == 'search':
            return Player.objects.filter(full_name__contains=self.request.GET.get('q'))
        
        return Player.objects.all()
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = self.get_queryset()
        serializer = serializers.PlayerSerializer(query, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    
class ParticipantViewSet(viewsets.ModelViewSet):
    '''
    Handles the standings of a given tournament
    '''
    serializer_class = serializers.ParticipantSerializer
    
    def get_queryset(self):
        tournament = self.kwargs['tournament']
        return Participant.objects.select_related('player').filter(tournament_id=tournament).order_by('position')
    
    
class FileUploadView(generics.GenericAPIView):
    parser_classes = [FormParser, MultiPartParser]
    serializer_class = serializers.FileUploadSerializer
    
    def post(self, request, *args, **kwargs):
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        config = serializer.validated_data['config']
        name = config.name.lower() 
        if name == 'config.tsh':
            data = serializer.validated_data['data']
            name = data.name.lower()
            if name == 'a.t':
                
                tourney, created = tsh_to_json.process_config_tsh( config.read().decode() )
                if not created:
                    games = tsh_to_json.tsh_to_json_data( data.read().decode().split("\n") )
                    tsh_to_json.import_tournament(games, tourney)
                
                    return Response({'status': 'ok'}) 
                
                else:
                    return Response({'error': "A tournament by that name exists"} , status=400)
                
            else:
                return Response({'error': "Please use a file named a.t as your tournament data file"} , status=400)
        
        else:
            return Response({'error': "Please use a file named config.tsh as the first file"} , status=400)
            
    
