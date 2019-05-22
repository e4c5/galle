from django.contrib import admin
from pair.models import Tournament

class TournamentAdmin(admin.ModelAdmin):
    list_display = ['name','start_date']
    
admin.site.register(Tournament, TournamentAdmin)