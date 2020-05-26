from unittest import TestCase
from app import app
from flask import session
from boggle import Boggle


class FlaskTests(TestCase):
    def setUp(self):
        """Stuff to do before every test."""

        self.client = app.test_client()
        app.config['TESTING'] = True
        app.config['DEBUG_TB_HOSTS'] = ['dont-show-debug-toolbar']

    def test_root(self):
        with self.client as client:
            with client.session_transaction() as change_session:
                change_session['high-score'] = 23
                change_session['games-played'] = 5
            resp = self.client.get('/')
            html = resp.get_data(as_text=True)

            self.assertEqual(resp.status_code, 200)
            self.assertIn('<h1>BOGGLE!</h1>', html)
            self.assertIn("<button id='start'>Start Game</button>", html)
            self.assertIn('board', session)
            self.assertIsInstance(session['board'], list)
            self.assertEqual(len(session['board']), 5)
            self.assertEqual(len(session['board'][-1]), 5)
            self.assertEqual(session['high-score'], 23)
            self.assertEqual(session['games-played'], 5)

    def test_ok(self):
        with self.client:
            with self.client.session_transaction() as change_session:
                change_session['board'] = [['C', 'O', 'D', 'E', 'R'], ['C', 'O', 'D', 'E', 'R'], [
                    'C', 'O', 'D', 'E', 'R'], ['C', 'O', 'D', 'E', 'R'], ['C', 'O', 'D', 'E', 'R']]

            resp = self.client.get('/guess?guess=coder')

            self.assertEqual(resp.status_code, 200)
            self.assertEqual(resp.json['result'], 'ok')

    def test_not_on_board(self):
        self.client.get('/')
        resp = self.client.get('/guess?guess=impossible')
        self.assertEqual(resp.json['result'], 'not-on-board')

    def test_not_word(self):
        self.client.get('/')
        resp = self.client.get('/guess?guess=aoisgjaoigjaiogjag')
        self.assertEqual(resp.json['result'], 'not-word')

    def test_game_over(self):
        with self.client as client:
            with client.session_transaction() as change_session:
                change_session['high-score'] = 5
                change_session['games-played'] = 0

            self.client.get('/')
            resp = self.client.post('/game-over', json={'score': 10})

            self.assertEqual(resp.json['newRecord'], True)

            self.client.get('/')
            self.assertEqual(session['games-played'], 1)
            self.assertEqual(session['high-score'], 10)
