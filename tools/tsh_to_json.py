import re
import time
import json

from django.db import transaction

from pair.models import Tournament
    
def tsh_to_json(path):
    '''
    Generated a JSON from a tournament data file
    '''
    with open(path) as f:
        return tsh_to_json_data(f)
        
        
def tsh_to_json_data(f):
    players = [{'name': 'bye'}]
    rounds = 0;

    for seed, line in enumerate(f):
        if line and len(line) > 30 :
       
            rating = re.search('[0-9]{1,4} ', line).group(0).strip()
            name = line[0: line.index(rating)].strip()
            newr = None
            data = line[line.index(rating):]
            data = data.split(';')
            opponents = data[0].strip().split(' ')[1:]
            scores = data[1].strip().split(' ')
            p12 = None
            rank = None

            offed = False
            
            for d in data:
                obj = d.strip().split(' ')
                obj_name = obj[0].strip()
                itms = obj[1:]
                
                if obj_name == 'p12':
                    p12 = itms
                elif obj_name == 'newr':
                    newr = d.strip().split(' ')[1:]

                elif obj_name == 'rrank':
                    # after correcting for spread caps, this data may not be present
                    # for all rounds if the rat or rrat commands have been executed.
                    tmp_rank = itms 
                    if not rank:
                        rank = tmp_rank
                    else :
                        if len(tmp_rank) > len(rank):
                            rank = tmp_rank

                elif obj_name == 'rcrank' and rank == None:
                    # rcank is without correcting for spread caps etc.
                    rank = [0] + itms
                elif obj_name == 'off':
                    offed = True
                   

            if rank != None:
                if opponents and len(rank) > len(opponents) :
                    rank = rank[1:]

                if not p12:
                    p12 = ['3'] * (len(rank)+1)

            players.append({'name': name, 'opponents' :opponents,'scores':scores,
                'p12': p12, 'rank': rank,'newr': newr, 'off': offed, 'seed': seed,
                'old_rating': rating})
            
            if len(scores) > rounds :
                rounds = len(scores)
            
    if len(players) < 2:
        print('a.t file does not contain any data')
        return {}
    
    return players
    
def json_to_tsh(data):
    '''
    Reverse of tsh_to_json
    '''
    output = []
    
    for record in data:
        if record['name'] != 'bye':
            row = "{0} {1} {2}; {3}; ".format(record['name'], 
                                                            record['old_rating'],
                                                            " ".join(record['opponents']), 
                                                            " ".join(record['scores']))
            board = record.get('board')
            if board:
                row += "board " + " ".join(record.get('board')) + "; "
                                           
                                           
            p12 = record.get('p12')
            if p12:
                row += "board " + " ".join(p12) + ";"
        
            output.append(row)
        
    return output

def process_config_tsh(data):
    '''
    Import a tsh confirguration
    '''

    name = ''
    for line in data.split("\n") :
        parts = line.split('=')
        cname = parts[0].strip()
        if len(parts)  == 2 and cname == "config event_name" :
            name = re.sub("""['"]""", '', parts[1].strip())
        if len(parts)  == 2 and cname == "config event_date" :
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
                
        if len(parts) == 2 and cname == 'config spread_cap':
            spread_cap = parts[1].strip() 

    slug=Tournament.tournament_slug(name)
    tourney, created = Tournament.objects.get_or_create(slug=slug, 
                                                defaults={'start_date' : start_date, 
                                                          'rated': True, 'name': name,
                                                          'slug': slug } )

    return tourney, created



def import_tournament(players, tourney):
    spread_cap = False

    if tourney.spread_cap :
        spread_cap = json.loads(tourney.spread_cap)


    players[0]['scores'] = [0] * len(players[1]['scores'])
    
    for idx, values in enumerate(players):
        participant = Participant.get_by_player(values['name'],tourney)
        print(participant, participant.id, tourney.id)
        if values['name'] != 'bye':
            participant.old_rating = values['old_rating']
            if values['rank']:
                participant.position = values['rank'][-1]

            if values['off']:
                print('Offed: ', values['name'])
                values['opponents'] = [b for b in values['opponents'] if int(b) > 0]
                participant.offed = 1;
                participant.games = len(values['opponents'])
            else :
                participant.games = len(values['opponents'])

            if values['newr'] and tourney.rated:
                participant.new_rating = int(values['newr'][-1])
                if participant.new_rating < 500:
                    participant.new_rating = 500
                
        values['participant'] = participant


    saved = []

    
    with transaction.atomic():
        for player in players[1:] :
            i = 0
            wins = 0
            spread = 0
            participant = player['participant']
    
            standings = []
    
            for opposite in player['opponents'] :
                try :
                     
                    opponent = players[int(opposite)]
    
                    player_score = player['scores'][i]
    
                    opponent_score = opponent['scores'][i]
                    p12 = player['p12'][i]
    
                    if opponent['name'] == 'bye' :
                        margin = int(player['scores'][i])
                    else :
                        margin = int(player['scores'][i]) - int(opponent['scores'][i])
        
                    if margin > 0 :
                        wins += 1
                    if margin == 0 :
                        wins += 0.5
                    if spread_cap and i < len(spread_cap):
                        max_margin = int(spread_cap[i])
                        if max_margin < margin :
                            margin = max_margin
                            #print 'adjusted spread cap round ',i
    
                        if margin < 0 and margin < (max_margin * -1)  :
                            #print 'adjusted spread cap for negative round ',i, margin, max_margin
                            margin = -max_margin
    
                    spread += margin
                    if p12 == '3':
                        # to be decided by drawing a tile and probably
                        # not entered in the records.
                        if opponent['name'] != 'bye':
                            if opponent['p12'][i] == '3':
                                # let us arbitarily assign the current player as starting.
                                opponent['p12'][i] = '2'
                                player['p12'][i] = '1'
                                start_first = True
                            else:
                                if opponent['p12'][i] == '2':
                                    # we have already arbitarily decided that the other player
                                    # would be flagged as going second.
                                    player['p12'][i] = '1'
                                    start_first = True
                                else :
                                    player['p12'][i] = '2'
                                    start_first = False
                        else :
                            # this is a by. We will arbitiarly set the current user as starting
                            start_first = True
                    else :
                        if p12 == '1':
                            start_first = True
                        else:
                            start_first = False
    
                    if player['rank']:
                        if player['off']:
                            rank = None
                        else :
                            rank = player['rank'][i]
    
                    else:
                        rank = None
                                        
                    st = {'score_against': opponent_score, 'score_for': player_score,
                            'participant': participant,'opponent': opponent['participant'],
                            'tournament': tourney,
                            'wins': wins , 'game': i+1 , 'first': start_first,
                            'spread': spread, 'position':  rank }
    
                    standing = Standing(**st)
                    standings.append(standing)
                    
                except Exception as e:
                    print("no result for ", player['name'], 'round', i, tourney.name)

                    player_score = None
                    opponent_score = None
                    margin = None
                    start_first = False
                
                i += 1
    
            if standings:
                print('saved')
                Standing.objects.bulk_create(standings)
                st = standings[-1]
                participant.spread = st.spread
                participant.wins = st.wins
                participant.save()
            
    t2 = time.time()
    print("Second part ", t2 - t1)
    
