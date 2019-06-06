from rest_framework import viewsets
from rest_framework.response import Response

from django.shortcuts import render, redirect


from pair import serializers
from pair import forms
from pair.models import TournamentRound, RoundResult, Participant, Tournament, Player
from tools import tsh_to_json

class TournamentViewSet(viewsets.ModelViewSet):
    '''
    Handles the tournaments
    '''
    def get_serializer_class(self):
        if self.action == 'list':
            return serializers.TournamentListSerializer
        
        return serializers.TournamentDetailSerializer
    
    def get_queryset(self):
        return Tournament.objects.prefetch_related('rounds').all()
        
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
        
        player = self.request.query_params.get('player')
        if player:
            return qs.filter(participant__player__id=player)
        return qs
    
    def update(self, request, *args, **kwargs):
        pk = kwargs.get('pk')
        resp = super().update(request, *args, **kwargs)
        return resp
    
class StandingsViewSet(viewsets.ModelViewSet):
    '''
    Handles the standings of a given tournament
    '''
    serializer_class = serializers.StandingSerializer
    
    def get_queryset(self):
        tournament = self.kwargs['tournament']
        return Participant.objects.select_related('player').filter(tournament_id=tournament)
    
   
def home(request):
    '''
    The home page.
    
    Currently a list of tournaments
    '''
    return render(request, "index.html", {'tournaments': Tournament.objects.all()})

def start(request, slug=None):
    '''
    Start a new tournament
    '''

    if slug:
        tournament = Tournament.objects.get(slug=slug)
        form = forms.PlayerForm(request.POST)
        if request.method == 'POST':
            if form.is_valid():
                players = form.cleaned_data['players'].split("\n")
                for player_name in players:
                    player, created = Player.get_by_name(player_name)
                    participant, created = Participant.objects.get_or_create(player_id=player.id, tournament=tournament)
                
                return redirect(tournament.get_absolute_url())
            
        return render(request,'players.html', {'tournament': tournament, 'form': form})
    else:
        return render(request, 'start.html')

def import_tsh(request):
    if request.method == 'POST':
        form = forms.UploadForm(request.POST, request.FILES)
        if form.is_valid():
            config = request.FILES['config_file'].read().decode('utf-8')
            data = request.FILES['at_file'].read().decode('utf-8')
            tourney, created = tsh_to_json.process_config_tsh(config)
            if created:
                redirect('/')
                
    else:
        form = forms.UploadForm()
    return render(request, 'import.html', {'form': form})

        
def tournament(request, slug):
    tournament = Tournament.objects.get(slug=slug);
    return render(request, "tournament.html", {'tournament': tournament});

    