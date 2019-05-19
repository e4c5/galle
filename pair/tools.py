import time
import sys
import re
import os
import json

import traceback

if __name__ == '__main__': #pragma nocover
    # Setup environ
    sys.path.append(os.getcwd())

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pair.settings")

    import django
    django.setup()


from pair.models import Tournament, Participant, TournamentRound, RoundResult


def process_config_tsh(path):
    '''
    The TSH file will yield ultra usefull information like the tournament name
    '''
    pairing = {'rr': TournamentRound.ROUND_ROBIN, 'RandomPair': TournamentRound.RANDOM,
               'ns': TournamentRound.SWISS, 'koth': TournamentRound.KOTH}
    
   
    try:
        with open(path, 'r') as f:
            t = None
            rounds = []
            name = None
            start_date = None
            for line in f :
                parts = line.split('=')
                cname = parts[0].strip()
                if len(parts)  == 2:
                    if cname == "config event_name" :
                        name = re.sub("""['"]""", '', parts[1].strip())
                    
                    if cname == "config event_date" :
                        start_date = re.sub("""['"]""", '', parts[1].strip())
                        start_date = re.sub(' ?(and|&|-) ?[0-9]{1,2},','',start_date)
                        start_date = re.sub(',','', start_date)
                        
                        try:
                            dt = time.strptime(start_date,'%B %d %Y')
                            start_date = time.strftime('%Y-%m-%d', dt)
                        except ValueError:
                            try:
                                dt = time.strptime(start_date,'%b %d %Y')
                                start_date = time.strftime('%Y-%m-%d', dt)
                            except ValueError:
                                q = start_date.split(' ')
                                start_date = "{0} {1} {2}".format(q[0], q[1], q[-1])
                                dt = time.strptime(start_date, '%B %d %Y')
                                start_date = time.strftime('%Y-%m-%d', dt)
                            
                    if cname == 'config spread_cap':
                        spread_cap = json.loads(parts[1].strip()) 
                        for i, spread in enumerate(spread_cap):
                            rounds[i].spread_cap = spread
                            
                else:
                    if line.startswith('autopair'):
                        parts = line.split(' ')
                        # autopair a 1 2 ns 10 1 a
                        rnd = TournamentRound(round_no=parts[3], pairing_system=pairing[parts[4]],
                                              based_on=parts[2], repeats=parts[-3])
                        rounds.append(rnd)
                        
            if name and start_date:
                t = Tournament.get_by_name(name, start_date = start_date)
                for rnd in rounds:
                    rnd.tournament = t
                    rnd.save()
                    

            return t

    except Exception as e :
        print('---', path , '---')
        traceback.print_exc()
        pass
    
    return False;


def process_data(at_file, tourney):
    '''
    Used for processing the contents of a.t files.
    '''
 
    players = [{'name': 'bye', 'participant': Participant.get_by_player('Bye',tourney)}]
    rounds = tourney.rounds.all().order_by('round_no').values()

    with open(at_file) as f:
        for line in f:
            if line and len(line) > 30 :
                # print(line)
                rating = re.search('[0-9]{1,4} ', line).group(0).strip()
                name = line[0: line.index(rating)].strip()
                data = line[line.index(rating):]
                data = data.split(';')
                opponents = data[0].strip().split(' ')[1:]
                scores = data[1].strip().split(' ')
                p12 = None
                
                for d in data:
                    obj = d.strip().split(' ')
                    obj_name = obj[0].strip()
                    itms = obj[1:]
                    
                    if obj_name == 'p12':
                        p12 = itms
    
                players.append({'name': name, 'opponents' :opponents,'scores':scores, 'p12': p12,
                                'participant' : Participant.get_by_player(name,tourney)})
                
        if len(players) < 2:
            print('a.t file does not contain any data')
            return
    
        players[0]['scores'] = [0] * len(players[1]['scores'])
        
        for player in players[1:] :

            wins = 0
            spread = 0
            participant = player['participant']
    
   
            standings = []
    
            for i, opposite in enumerate(player['opponents']):
                try :
                     
                    opponent = players[int(opposite)]
                    player_score = player['scores'][i]
    
                    opponent_score = opponent['scores'][i]
                    p12 = player['p12'][i]
    
                    if opponent['name'] == 'bye' :
                        spread = int(player['scores'][i])
                    else :
                        spread = int(player['scores'][i]) - int(opponent['scores'][i])
        
                    if spread > 0:
                        wins += 1
                        if rounds[i]['spread_cap']:
                            spread = min(rounds[i]['spread_cap'], spread)
                    elif spread == 0 :
                        wins += 0.5
                    else:
                        if rounds[i]['spread_cap']:
                            spread = max(-rounds[i]['spread_cap'], spread)
    
                    st = {'score_against': opponent_score, 'score_for': player_score,
                            'participant': participant,'opponent': opponent['participant'],
                            'tournament': tourney, 
                            'wins': wins , 'game_id': rounds[i]['id'] , 'first': p12,
                            'spread': spread}
    
                    standing = RoundResult(**st)
                    standings.append(standing)
                    
                except Exception as e:
                    print("no result for ", player['name'], 'round', i, tourney.name)
                    traceback.print_exc()
                    player_score = None
                    opponent_score = None
                    return

    
            if standings:
                RoundResult.objects.bulk_create(standings)
                st = standings[-1]
                participant.spread = st.spread
                participant.wins = st.wins
                participant.games = len(standings) - 1
                participant.save()
                        

if __name__ == '__main__':  #pragma nocover 
    '''
    Before process_at_file make sure that the a.t file has final round results
    by using the 'rat' command in tsh
    '''
    t = process_config_tsh("/home/raditha/SLSL/tsh/2018/SOY2/config.tsh")
    process_data("/home/raditha/SLSL/tsh/2018/SOY2/a.t", t)
