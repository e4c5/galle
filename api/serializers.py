from rest_framework import serializers
from pair.models import TournamentRound, RoundResult, Participant, Tournament

class RoundSerializer(serializers.ModelSerializer):
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

    
    class Meta:
        model = RoundResult
        fields = ('id', 'participant','opponent', 'score_for','score_against', 
                  'first', 'round_no','spread')
        
        
class StandingSerializer(serializers.ModelSerializer):
    player = serializers.StringRelatedField()

    class Meta:
        model = Participant
        fields = ('id','player','games','wins','spread')


class TournamentListSerializer(serializers.ModelSerializer):
    '''
    This serializer is only used to display the list of tournaments
    '''
    class Meta:
        model = Tournament
        fields = ('id','name', 'start_date', 'rated')


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
        fields = ('id','name', 'start_date', 'rated', 'num_rounds','current_round','rounds','slug')
        
                
# update pair_roundresult set score_for = NULL , score_against=NULL where game_id=36