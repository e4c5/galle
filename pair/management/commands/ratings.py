from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from tools import plinrat

class Command(BaseCommand):
    help = 'A tool for importing ratings from .RT2 files'

    def add_arguments(self, parser):
        parser.add_argument('filename')
        
    @transaction.atomic
    def handle(self, *args, **options):
        filename = options['filename']
        plinrat.old_rating(filename)