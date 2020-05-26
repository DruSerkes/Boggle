const $form = $('.guess-form');
const $guess = $('#guess');
const $gameContainer = $('.game-container');
const $message = $('.message');
const $score = $('.score');
const $timer = $('.timer');
const $start = $('#start');
const $moreInfo = $('.more-info');
const $highscore = $('.highscore');
const $gamesPlayed = $('.games-played');
const $playAgain = $('.play-again');

// let currentScore = 0;
// let words = [];

class BoggleGame {
	constructor() {
		this.score = 0;
		this.words = new Set();
		this.time = 60;
		this.playGame();
	}

	updateScore() {
		$score.text(this.score);
	}

	hideGame() {
		$gameContainer.addClass('hidden');
		$playAgain.removeClass('hidden');
	}

	showGame() {
		$gameContainer.removeClass('hidden');
		$start.addClass('hidden');
		if (!$playAgain.hasClass('hidden')) {
			$playAgain.addClass('hidden');
		}
	}

	updateRecord() {
		$highscore.text(this.score);
		this.displayMessage('Congrats - New High Score!');
	}

	runTimer() {
		let gameTimer = setInterval(() => {
			$timer.text(this.time);
			if (this.time === 0) {
				clearInterval(gameTimer);
				$timer.text(this.time);
				this.hideGame();
				this.gameOver();
			}
			this.time -= 1;
		}, 1000);
	}

	displayMessage(message) {
		$message.empty();
		$message.text(message);
		$guess.val('').focus();
	}

	async gameOver() {
		// send score as JSON to '/game-over'
		const response = await axios.post('/game-over', { score: this.score });

		// update DOM with response
		response.data.newRecord
			? this.updateRecord()
			: this.displayMessage('Good Game - Try again!');
	}

	async playGame(e) {
		this.showGame();
		$form.on('submit', this.handleSubmit.bind(this));
		this.runTimer.bind(this)();
	}

	async handleSubmit(e) {
		e.preventDefault();

		// get value from input field
		const word = $guess.val();
		if (!word) return;

		if (this.words.has(word)) {
			this.displayMessage("You've already guessed that word");
			return;
		}

		// save the response
		const response = await axios.get('/guess', {
			params : {
				guess : word
			}
		});

		// Handle result
		let result = response.data.result;

		if (result === 'not-word') {
			this.displayMessage('Sorry, that is not a word in our dictionary');
		} else if (result === 'not-on-board') {
			this.displayMessage('Sorry, that word is not on the board!');
		} else {
			this.words.add(word);
			this.displayMessage('You got a word!');
			this.score += word.length;
			this.updateScore();
		}
		// this.displayMessage('Sorry, that word is not on the board!');
	}
}

$start.on('click', function() {
	boggle = new BoggleGame();
});

$playAgain.on('click', function() {
	location.reload();
});

// commented out to test refactored OOP
/*
async function handleSubmit(event) {
	event.preventDefault();

	// get value from input field
	const word = $guess.val();
	if (!word) return;

	if (words.includes(word)) {
		message = "You've already guessed that word";
		displayMessage(message);
		return;
	}

	// save the response
	const response = await axios.get('/guess', {
		params : {
			guess : word
		}
	});

	// Handle result
	let result = response.data.result;

	if (result === 'not-word') {
		message = 'Sorry, that is not a word in our dictionary';
	} else if (result === 'not-on-board') {
		message = 'Sorry, that word is not on the board!';
	} else {
		words.push(word);
		message = 'You got a word!';
		let score = word.length;
		updateScore(score);
	}
	displayMessage(message);

	// $guess.val('').focus();
}

async function playGame(e) {
	e.preventDefault();

	currentScore = 0;
	showGame();
	$form.on('submit', handleSubmit);

	runTimer();
}

async function gameOver() {
	// send score as JSON to '/game-over'
	const response = await axios.post('/game-over', { score: currentScore });

	// update DOM with response
	response.data.newRecord ? updateRecord() : displayMessage('Good Game - Try again!');
}

const displayMessage = (message) => {
	$message.empty();
	$message.text(message);
	$guess.val('').focus();
};

const runTimer = () => {
	let timeleft = 10;
	let gameTimer = setInterval(function() {
		if (timeleft <= 0) {
			clearInterval(gameTimer);
			$timer.text(timeleft);
			hideGame();
			gameOver();
		}
		$timer.text(timeleft);
		timeleft -= 1;
	}, 1000);
};

function updateRecord() {
	$highscore.text(currentScore);
	displayMessage('Congrats - You Got A New High Score!');
}

const showGame = () => {
	$gameContainer.removeClass('hidden');
	$start.addClass('hidden');
	if (!$playAgain.hasClass('hidden')) {
		$playAgain.addClass('hidden');
	}
};

const hideGame = () => {
	$gameContainer.addClass('hidden');
	$playAgain.removeClass('hidden');
};

const updateScore = (score) => {
	currentScore += score;
	$score.text(`${currentScore}`);
};
*/
