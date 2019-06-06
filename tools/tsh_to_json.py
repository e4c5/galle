import re
import time

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
    from pair.models import Tournament
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

