from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from tools import tsh_to_json

class Command(BaseCommand):
    help = 'A tool for building a dictionary of letters in each word'

    @transaction.atomic
    def handle(self, *args, **options):
        with open('/home/raditha/SLSL/tsh/2019/SOY3/config.tsh') as fp:
            tourney, created = tsh_to_json.process_config_tsh(fp.read())
            games = tsh_to_json.tsh_to_json('/home/raditha/SLSL/tsh/2019/SOY3/a.t')
            print(games)
            tsh_to_json.import_tournament(games, tourney)