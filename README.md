# Boggle 
Built for [Springboard](http://www.springboard.com)


## What this project was about:  
This project came on the heels of learning Python, Flask, and the beginnings of back-end development. 
This project was the first that tied front and back-end development together, as it required use of Flask/Python server-side, and client-side built with HTML, CSS, and JavaScript (jQuery). 
This project also was the first to preserve state within the session (cookies), and make use of Flask Jinja for dynamic template design.  

## What I did: 
I was given a boggle.py file that defines a Boggle class to work with in my app.

I began by definining a view function for the root route that would create a new boggle board and store it in the session. I used that board to dynamically generate a boggle game board on the DOM (Flask Jinja) upon user starting the game, alongside a form for the user to input words they see on the board. 

Submitting user input first checks if the word being guessed has already been guessed; if so it lets the user know they've already used that word. If not, the client makes a GET request with AJAX (axios) to the server which is handled in the /guess route view function. This function gets the gameboard from the session and the word from the request object (query string), then checks if the word is in the dictionary provided and on the board. This function returns either "not-word", "not-on-board", or "ok."

The client side logic then renders a response on the DOM based on the server response. If ok, it also updates the in-game score variable. 

Starting the game also begins a countdown timer which is rendered on the DOM as it counts down every second. When the game timer runs out, the client makes an AJAX POST request to the server /game-over route with the game score. 

The server resets the high score in the session if necessary, increments games-played in the session, and returns the new number of games played + a boolean for whether or not the game score is a new high score. 

The client then updates the DOM with the new number of games played, and the new high score if necessary (both are displayed on screen all game). 

The user is then offered the option to reload a new game which I currently have as a page reload. 

## What I learned:
This was a BIG one for me, as it was my first time marrying my front-end and back-end languages. This project, while challenging at first to fully understand the concept of having them communicate, finally gave me a clear view of the relationship between client and server, and a deeper conceptual understanding of how these interactions actually work.

From a technical angle, this project was also my first time having to switch between this many languages and frameworks. I definitely had to go back to my notes from the past 2 months for some parts, but I enjoyed the challenge this brought, and eventually settled into a zone while switching between files in my directory. 

I refactored my front-end into OOP after the fact, which I found easier than I expected, so I'm getting more comfortable with (or at least less awkward with) OOP. I look forward to getting to a point where I find it natural writing my codebase in this paradigm from the start.

## Looking forward:
Specifically for this project, I would like to revisit the codebase eventually to go about starting a new game without having to reload the page. 

Now that I have a clearer idea of how the client-server relationship works, I expect future projects of this nature to feel less daunting (joke's on me when I begin SQL this weekend and learn to communicate with a Database, I'm sure). 
