from django.shortcuts import render, redirect

from pair import forms
from pair.models import TournamentRound, RoundResult, Participant, Tournament, Player
from tools import tsh_to_json

  
def home(request, slug=None, player=None):
    '''
    The home page.
    
    Currently a list of tournaments
    '''
    return render(request, "index.html")

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
    message = ''
    if request.method == 'POST':
        form = forms.UploadForm(request.POST, request.FILES)
        if form.is_valid():
            config = request.FILES['config_file'].read().decode('utf-8')
            data = request.FILES['at_file'].read().decode('utf-8')
            tourney, created = tsh_to_json.process_config_tsh(config)
            if created:
                games = tsh_to_json.tsh_to_json_data(data.split("\n"))
                tsh_to_json.import_tournament(games, tourney)
                redirect('/')
            else :
                message = 'A tournament by that name already exists'    
    else:
        form = forms.UploadForm()
    return render(request, 'import.html', {'form': form, 'message': message})
        

    