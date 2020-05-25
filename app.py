from boggle import Boggle
from flask import Flask, render_template, request, flash, redirect, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
debug = DebugToolbarExtension(app)
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False

boggle_game = Boggle()


@app.route('/')
def make_game():
    board = boggle_game.make_board()
    session['board'] = board
    games_played = session.get('games-played', 0)
    highscore = session.get('high-score', 0)
    return render_template('index.html', board=board, highscore=highscore, games_played=games_played)


@app.route('/guess')
def check_guess():
    board = session['board']
    guess = request.args['guess']
    response = boggle_game.check_valid_word(board, guess)
    return jsonify({'result': response})


@app.route('/game-over', methods=["POST"])
def update_stats():
    # Update games played
    games_played = session.get('games-played', 0)
    session['games-played'] = games_played + 1

    # Update high score
    score = request.json['score']
    highscore = session.get('high-score', 0)
    session['high-score'] = max(highscore, score)

    return jsonify(newRecord=score > highscore)
