const $form = $('.guess-form');
const $guess = $('#guess');
const $gameContainer = $('.game-container');
const $message = $('.message');
const $score = $('.score');
const $timer = $('.timer');
const $start = $('#start');

let currentScore = 0;

$start.on('click', function(e) {
	e.preventDefault();

	showGame();
	$form.on('submit', handleSubmit);

	runTimer();
});

const displayMessage = (message) => {
	$message.empty();
	$message.text(message);
};

const updateScore = (score) => {
	currentScore += score;
	$score.text(`${currentScore}`);
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

async function handleSubmit(event) {
	event.preventDefault();

	// get value from input field
	const word = $guess.val();
	if (!word) return;

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
		message = 'You got a word!';
		let score = word.length;
		updateScore(score);
	}
	displayMessage(message);

	$guess.val('').focus();
}

async function gameOver() {
	// send score as JSON to '/game-over'
	const response = await axios.post('/game-over', { score: currentScore });

	// --> back over to app.js
	// update DOM with response
}

const showGame = () => {
	$form.removeClass('hidden');
	$message.removeClass('hidden');
	$gameContainer.removeClass('hidden');
};

const hideGame = () => {
	$form.addClass('hidden');
	$message.addClass('hidden');
	$gameContainer.addClass('hidden');
};
