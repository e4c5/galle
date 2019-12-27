from rest_framework import serializers
from pair.models import TournamentRound, RoundResult, Participant, Tournament, Player


class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = ['id', 'full_name', 'country', 'slug', 'wespa_rating', 'national_rating']
        
        
class RoundSerializer(serializers.ModelSerializer):
    '''
    A round in our tournament
    
    The information includes pairing system, number of repeates, which round
    standings are used for pairing etc
    '''
    class Meta:
        model = TournamentRound
        fields = ('id','round_no','spread_cap','pairing_system','repeats','based_on')


class ResultSerializer(serializers.ModelSerializer):
    '''
    Results of a given round.
    
    It's also possible to fetch all of them at once by requesting without a round id
    '''
    participant = serializers.StringRelatedField()
    opponent = serializers.StringRelatedField()
    opponent_id = serializers.IntegerField(source="opponent.id")
    
    class Meta:
        model = RoundResult
        fields = ('id', 'participant','opponent', 'score_for','score_against', 'opponent_id',
                  'first', 'round_no','spread')
        
        
class ParticipantSerializer(serializers.ModelSerializer):
    '''
    Used for listing of participants
    For example used by TournamentDetailSerializer to add the list of players
    who took part in the event.
    '''
    player = PlayerSerializer(read_only=True)

    class Meta:
        model = Participant
        fields = ('id','player','games','wins','spread',
                  'new_rating','old_rating','position','offed')


class TournamentListSerializer(serializers.ModelSerializer):
    '''
    This serializer is only used to display the list of tournaments
    '''
    class Meta:
        model = Tournament
        fields = ('id','name', 'start_date', 'rated', 'slug')


class TournamentDetailSerializer(serializers.ModelSerializer):
    '''
    This serializer is for individual tournaments
    '''
    rounds = RoundSerializer(many=True)
    
    def create(self, validated_data):
        rounds = validated_data.pop('rounds') 
        tournament = Tournament.objects.create(**validated_data)
        for rnd in rounds:
            rnd['tournament_id'] = tournament.pk
            TournamentRound.objects.create(**rnd)
            
        return tournament
    
    class Meta:
        model = Tournament
        fields = ('id','name', 'start_date', 'rated', 'num_rounds','current_round',
                  'rounds','slug')
        

class FileUploadSerializer(serializers.Serializer):
    '''
    Serializer for importing from TSH.
    
    Two different files will be uploaded - the first being the config.tsh and the
    second being the a.t file
    '''
    config = serializers.FileField()
    data = serializers.FileField()
    
    
    
    