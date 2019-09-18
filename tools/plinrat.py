import time
from pair.models import Player

def old_rating(fname):
    '''
    Process the contents of an RT2 file.

    The RT2 file contains the ratings used by the tournament director at the start
    of a tournament.

    These files are processed and there data are stored in the RT2 table for 
    calculations
    '''

    with open(fname) as f:
        line = f.readline();
        parts = line.split()
        print(fname, parts[-1]) 
        dt = time.strptime(parts[-1],'%Y%m%d')
        start_date = time.strftime('%Y-%m-%d', dt)
       
        
        for line in f:
            try :
                name = line[9:30].strip()
                games = int(line[30:34].strip())
            except:
                name = line[9:31].strip()
                games = line[31:34].strip()

            if name:
                country = line[5:8].strip()
                player, created = Player.get_by_name(name, country = country)
                
                try:
                    last = player.tournament_set.order_by('-start_date')[0]
                    if last.start_date > start_date:
                        continue
                    
                except IndexError:
                    pass
                
                player.national_rating = line[4].strip()
                player.games = line[34:39].strip()