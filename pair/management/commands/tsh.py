from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from tools import tsh_to_json

class Command(BaseCommand):
    help = 'A tool for importing a tsh configuration file and data'

    def add_arguments(self, parser):
        parser.add_argument('config')
        parser.add_argument('data')
        
    @transaction.atomic
    def handle(self, *args, **options):
        with open(options['config']) as fp:
            tourney, created = tsh_to_json.process_config_tsh(fp.read())
            games = tsh_to_json.tsh_to_json(options['data'])
            print(games)
            tsh_to_json.import_tournament(games, tourney)