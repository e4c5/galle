import sys
import os
from collections import deque

if __name__ == '__main__': #pragma nocover
    # Setup environ
    sys.path.append(os.getcwd())

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pair.settings")

    import django
    django.setup()

from pair.models import Tournament, Participant, TournamentRound, RoundResult, Player

class RoundRobin(object):
    
    def __init__(self, tournament):
        self.tournament = tournament
        self.num_players = self.tournament.participant_set.count()
        
        if self.num_players % 2 == 1:
            bye, _ = Player.get_by_name('Bye')
            Participant.objects.get_or_create(player=bye, tournament=tournament)
            self.num_players += 1
        
        self.num_rounds = self.num_players - 1
        self.games = [[None for x in range(self.num_rounds)] for x in range(self.num_players)]
        
    def berger_table(self):
        '''
        Produces a Berger table. Standard pairing with no fixing
        '''
        rotator = [i for i in range(self.num_players)]
        pairs = []
        
        participants = list(tournament.participant_set.order_by('id').all())
        rounds = list(tournament.rounds.order_by('round_no').all())
        
        mode = len(rotator)//2
        
        for rnd in range(self.num_rounds):
            first = rotator[0:mode]
            second = rotator[mode:]
            second.reverse()

            #print first, second
            for idx in range(mode):
                player = first[idx]
                opponent = second[idx]
                self.games[player][rnd] = opponent
                self.games[opponent][rnd] = player
                
                pairs.append(RoundResult(participant=participants[player],opponent=participants[opponent],
                                         tournament=self.tournament, game=rounds[rnd]))
                pairs.append(RoundResult(participant=participants[opponent],opponent=participants[player],
                                         tournament=self.tournament, game=rounds[rnd]))
            popped = rotator.pop()
            rotator.insert(1,popped)
    
        RoundResult.objects.bulk_create(pairs)
        
    def print_table(self):
        print(self.games)
        num_players = self.num_players
        players = self.tournament.participant_set.all()
        
        sys.stdout.write("{:<20}".format(''))
        for rnd in range(1,num_players+1):
            sys.stdout.write("{:<20}".format('{0},{1}'.format(rnd*2-1,rnd*2)))
        print ('')
    
        for i in range(num_players):
            print("{0:<10}".format(str(players[i])), end=' | ')
            
            for j in self.games[i]:
                if j is not None:
                    if j == -1:
                        p = 'XX'
                    else :
                        p = players[j]
    
                    print("{:<20}".format(str(p)), end=' ')
                else :
                    sys.stdout.write("{:<20}".format('None'))
    
            print ('')
            
if __name__ == '__main__':
    
    tournament = Tournament.objects.get(pk=6)
    rr = RoundRobin(tournament)
    rr.berger_table()

            
