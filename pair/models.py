# -*- coding: utf-8 -*-

import re

from django.db import models
from django.utils.text import slugify
from django.core.cache import cache
from django.db import transaction
from django.db.models import Sum

class Player(models.Model):
    '''
    This is someone who has taken part in at least one tournament
    conducted by the Sri Lanka Scrabble League
    '''
    full_name = models.TextField()
    country = models.TextField(default='SL')
    slug = models.TextField(unique=True)
    
    def __str__(self):
        return self.full_name

    @classmethod
    def get_by_name(self, name, country='SL', create=True): 
        '''
        Player names have extra spaces and other junk.

        This method will sift through that junk, clean up the user name 
        and fetch the user from the database if a record is available.
        
        Some usernames are known to have errors, in such cases the NameCorrections
        models comes into place.
        
        Last but not least, if a user instance isn't found a new one will be 
        created (provided that the create flag is set to True
        '''
        if name :
            nl = name.strip()
            nl = nl.lower()
            slug = slugify(nl)
            key = 'pname{0}'.format(slug)

            pl = cache.get(key)
            if pl:
                # print key, 'from cache'
                return pl, False

            parts = nl.split(',')
#            print parts

            if len(parts) > 1 :
                parts.reverse()
                name = " ".join(parts).strip()
                correction_key = slugify(name)
                try :
                    correction = NameCorrection.objects.select_related().get(slug=correction_key)
                    cache.set(key, correction.player)

                    return correction.player, False
                
                except NameCorrection.DoesNotExist :
                    pass
                    
            else :
                correction_key = slug
                try :
                    correction = NameCorrection.objects.select_related().get(slug=slug)
                    cache.set(key, correction.player)

                    return correction.player, False
                except NameCorrection.DoesNotExist :
                    pass
            
            try :
                player = Player.objects.get(slug=correction_key)
                
                cache.set(key, player)
                return player, False
            except Player.DoesNotExist:
                try :
                    player = Player.objects.get(slug=correction_key[:19])
                    cache.set(key, player)
                    return player, False
                except Player.DoesNotExist:
                    pass
                player = Player(slug=correction_key, full_name=name.title(), country=country)
                if create :
                    player.save()
                    cache.set(key, player)
                return player, True
   

class Tournament(models.Model):
    ''' A tournament can sometimes have many sections, they can be rated or unrated.
    But one thing for sure they will have at least two players
    '''
    start_date = models.TextField()
    name = models.TextField()
    rated = models.IntegerField(default=True)
    slug = models.TextField(unique=True, blank=True)

    players = models.ManyToManyField(Player, through='Participant')

    def __unicode__(self):
        return self.name

    @classmethod    
    def tournament_slug(self, name):
        ''' Slugify tournament names so that we can use them in links '''
        name = re.sub('\(?sl\)?$', '', name.lower())
        return slugify(name.strip())
    
    @classmethod
    def get_by_name(self, tournament_name, start_date, rated=True):
        ''' Fetches a tournament instance from the databse, creates one if needed '''

        try :
            slug = Tournament.tournament_slug(tournament_name)
            tourney = Tournament.objects.get(slug=slug)
    
        except :
            tourney = Tournament.objects.create(name=tournament_name,
                                 rated=rated, start_date=start_date,
                                 slug=Tournament.tournament_slug(tournament_name))

        return tourney        

    def __str__(self):
        return self.name
    
    def get_absolute_url(self):
        return "/tournament/{0}/".format(self.slug)
    
    @property
    def num_rounds(self):
        '''
        Returns the number of rounds in the tournament
        '''
        return self.rounds.count()
    
    
    @property
    def current_round(self):
        '''
        Returns the current round
        
        That is the round that is in progress. None if the tournament has concluded. 
        '''
        try:
            rnd = self.rounds.filter(roundresult__score_for=None).order_by('-round_no')[0]
            return rnd.round_no
        except IndexError:
            return None
        
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = self.tournament_slug(self.name)
            
        super().save(*args, **kwargs)
        
class TournamentRound(models.Model):
    ROUND_ROBIN = "ROUND_ROBIN"
    SWISS = "SWISS"
    KOTH = "KOTH"
    RANDOM = "RANDOM"
    MANUAL = "MANUAL"
    
    PAIRING_CHOICES = ([ROUND_ROBIN, 'Round Robin'], [SWISS, 'Swiss'],
                       [KOTH, 'KOTH'], [RANDOM, 'Random'], [MANUAL,"Manual"])
    
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='rounds')
    round_no = models.IntegerField()
    spread_cap = models.IntegerField(null=True, blank=True)
    pairing_system = models.CharField(max_length=16, choices=PAIRING_CHOICES)
    repeats = models.IntegerField(default=0)
    based_on = models.IntegerField(null=True, blank=True)
        

class Rating(models.Model):
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    old_rating = models.IntegerField(default=0, null=True)
    new_rating = models.IntegerField(default=0, null=True)
    games = models.IntegerField(default=0, null=True)
    wins = models.FloatField(default=0, null=True)
    expected = models.FloatField(default=0, null=True)
    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE)
    

class NameCorrection(models.Model):
    '''
    There are countless mispellings in the tournament records. These leads
    to some players have two different recordsd and sometimes even ratings 
    errors
    '''

    player = models.ForeignKey(Player, blank=True, null=True, on_delete=models.CASCADE)
    slug = models.TextField()
    correct_form = models.TextField()
   
    def save(self, *args, **kwargs):
        super(NameCorrection, self).save(*args, **kwargs)

        try:
            old_player = Player.objects.get(slug=self.slug)
            with transaction.atomic() :
                Rating.objects.filter(player=old_player).update(player=self.player)
                Participant.objects.filter(player=old_player).update(player=self.player)
                old_player.delete()

        except Player.DoesNotExist:
            pass

    
class Participant(models.Model):
    ''' This is a Player who has taken part in a Tournament.
    Tournaments and players are linked 'through' this model.
    '''
    player = models.ForeignKey(Player, on_delete=models.CASCADE)
    old_rating = models.IntegerField(default=0, null=True)
    new_rating = models.IntegerField(default=0, null=True)
    games = models.IntegerField(default=0, null=True)
    wins = models.FloatField(default=0, null=True)

    tournament = models.ForeignKey(Tournament, on_delete=models.CASCADE, related_name='participants')

    spread = models.IntegerField(default=0, null=True)
    position = models.IntegerField(default=0, null=True)
    offed = models.IntegerField(default=0, null=True)
    seed = models.IntegerField(default=0, null=True)

    @classmethod
    def get_by_player(self, player_name, tournament):
        player, created = Player.get_by_name(player_name)
        participant, created = Participant.objects.get_or_create(tournament=tournament, player=player)
        
        return participant
        
    def __str__(self):
        try:    
            return self.player.__str__();
        except :
            return ""


class RoundResult(models.Model):
    ''' 
    The result of a single round in a tournament. 
    
    if the score_for and score_against are blank that means we haven't got the score just yet.
    '''
    participant = models.ForeignKey(Participant, related_name='player1', on_delete=models.PROTECT)
    opponent = models.ForeignKey(Participant, related_name='player2', on_delete=models.PROTECT)
    tournament = models.ForeignKey(Tournament, on_delete=models.PROTECT)
    wins = models.FloatField(default=0)  # the number of wins at the end of this round
    game = models.ForeignKey(TournamentRound, on_delete=models.PROTECT)
    spread = models.IntegerField(default=0)  # the spread for this round. 
        # in tournamens where there is a spread cap, this value will not be the difference between
        # score for and score against.
    position = models.IntegerField(default=0, null=True)  # the position at the end of this round
    score_for = models.IntegerField(null=True, blank=True)  # the players score
    score_against = models.IntegerField(null=True, blank=True)  # the opponent's score
    first = models.IntegerField(default=0)  # who start 1 means this player, 2 means the other 0 means tossed.

    def save(self, *args, **kwargs):
        '''
        Saves the result to the disk.
        
        Validates that the spread is with in the allowed spread cap. 
        Then updates the standings to reflect the new results.
        '''
        spread = self.score_for - self.score_against
        if spread < 0:
            spread = max(-spread, self.game.spread_cap)
        elif spread > 0:
            spread = max(spread, self.game.spread_cap)
            
        if self.pk:
            RoundResult.objects.filter(game=self.game
                    ).filter(opponent=self.participant
                    ).filter(participant=self.opponent
                    ).update(spread=-spread, 
                             score_for=self.score_against, score_against=self.score_for)

        super(RoundResult, self).save(*args, **kwargs)
        
        wins = RoundResult.objects.filter(participant=self.participant).filter(spread__gt=0).count()
        wins+= RoundResult.objects.filter(participant=self.participant).filter(spread=0).count() * 0.5
        spread = RoundResult.objects.filter(participant=self.participant).aggregate(Sum('spread'))
        
        self.participant.wins = wins
        self.participant.spread = spread['spread__sum']
        self.participant.save()
        
        
        wins = RoundResult.objects.filter(opponent=self.participant).filter(spread__gt=0).count()
        wins+= RoundResult.objects.filter(opponent=self.participant).filter(spread=0).count() * 0.5
        spread = RoundResult.objects.filter(opponent=self.participant).aggregate(Sum('spread'))
        
        self.opponent.wins = wins
        self.opponent.spread = spread['spread__sum']
        self.opponent.save()
        
    @property
    def round_no(self):
        return self.game.round_no
        
        