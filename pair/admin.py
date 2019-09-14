from django.contrib import admin
from pair.models import Tournament, Participant, RoundResult

class TournamentAdmin(admin.ModelAdmin):
    list_display = ['name','start_date']
    
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ['player','old_rating','new_rating','position']
        
        
class ResultAdmin(admin.ModelAdmin):
    list_display = ['participant','opponent','game','wins']
    
admin.site.register(Tournament, TournamentAdmin)
admin.site.register(Participant, ParticipantAdmin)
admin.site.register(RoundResult, ResultAdmin)