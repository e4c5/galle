import os
from django.test import TestCase
from tools import tsh_to_json

class TestTools(TestCase):
    
    def test_import_at(self):
        at_file = os.path.dirname(__file__) + "/data/a.t"
        players = tsh_to_json.tsh_to_json(at_file)
        self.assertEquals(9, len(players))
        self.assertEquals("bye", players[0]['name'])
        
    def test_import_config(self):
        config_file = os.path.dirname(__file__) + "/data/config.tsh"
        with open(config_file) as f:
            data = f.read()
            tourney, created = tsh_to_json.process_config_tsh(data)
            self.assertTrue(created)
    
            tourney, created = tsh_to_json.process_config_tsh(data)
            self.assertFalse(created)