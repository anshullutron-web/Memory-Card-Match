/* GET HTML ELEMENTS */
var gameBoard = document.getElementById("gameBoard");
var timerText = document.getElementById("timer");
var message = document.getElementById("gameMessage");
var playPauseBtn = document.getElementById("playPauseBtn");
var restartBtn = document.getElementById("restartBtn");
/* TIME VARIABLES */
var TOTAL_TIME = 90;
var timeLeft = TOTAL_TIME;
var timer;
/* GAME VARIABLES */
var firstCard = null;
var secondCard = null;
var lock = true;
var paused = false;
var matched = 0;
/* CARD VALUES */
var cardsData = [
    "🍎","🍎","🍌","🍌",
    "🍇","🍇","🍓","🍓",
    "🍒","🍒","🥝","🥝",
    "🍍","🍍","🍑","🍑"
];
/* SHUFFLE FUNCTION */
function shuffle(array) {
    var i;
    var j;
    var temp;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
/* CREATE GAME BOARD */
function createBoard(values) {
    var i;
    var card;
    gameBoard.innerHTML = "";
    for (i = 0; i < values.length; i++) {
        card = document.createElement("div");
        card.className = "card";
        card.dataset.value = values[i];
        card.innerHTML =
            '<div class="card-face card-front">' + values[i] + '</div>' +
            '<div class="card-face card-back"></div>';
        card.onclick = flipCard;
        gameBoard.appendChild(card);
    }
}
/* PREVIEW PHASE */
function previewCards() {
    var cards;
    var i;
    createBoard(cardsData);
    cards = document.getElementsByClassName("card");
    for (i = 0; i < cards.length; i++) {
        cards[i].classList.add("flip");
    }
    setTimeout(startGame, 3000);
}
/* START ACTUAL GAME */
function startGame() {
    var shuffled;
    var i;
    shuffled = [];
    for (i = 0; i < cardsData.length; i++) {
        shuffled[i] = cardsData[i];
    }
    shuffle(shuffled);
    createBoard(shuffled);
    timeLeft = TOTAL_TIME;
    timerText.innerHTML = timeLeft
    lock = false;
    startTimer();
}
/* TIMER FUNCTION */
function startTimer() {
    clearInterval(timer);
    timer = setInterval(function () {
        if (paused === false) {
            timeLeft = timeLeft - 1;
            timerText.innerHTML = timeLeft;
            if (timeLeft <= 0) {
                endGame(false);
            }
        }
    }, 1000);
}
/* FLIP CARD FUNCTION */
function flipCard() {
    if (lock === true) {
        return;
    }
    if (paused === true) {
        return;
    }
    if (this === firstCard) {
        return;
    }
    if (this.classList.contains("matched")) {
        return;
    }
    this.classList.add("flip");
    if (firstCard === null) {
        firstCard = this;
    } else {
        secondCard = this;
        lock = true;
        checkMatch();
    }
}
/* CHECK MATCH */
function checkMatch() {
    if (firstCard.dataset.value === secondCard.dataset.value) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matched = matched + 1;
        resetTurn();
        if (matched === cardsData.length / 2) {
            endGame(true);
        }
    } else {
        setTimeout(function () {
            firstCard.classList.remove("flip");
            secondCard.classList.remove("flip");
            resetTurn();
        }, 800);
    }
}
/* RESET TURN */
function resetTurn() {
    firstCard = null;
    secondCard = null;
    lock = false;
}
/* END GAME */
function endGame(win) {
    clearInterval(timer);
    lock = true;
    if (win === true) {
        message.innerHTML = "🎉 You won! All pairs matched in time.";
    } else {
        message.innerHTML = "⏱ Time over! Try again.";
    }
}
/* PLAY or PAUSE BUTTON */
playPauseBtn.onclick = function () {
    if (paused === false) {
        paused = true;
        playPauseBtn.innerHTML = "Play";
    } else {
        paused = false;
        playPauseBtn.innerHTML = "Pause";
    }
};
/* RESTART BUTTON */
restartBtn.onclick = function () {
    clearInterval(timer);
    matched = 0;
    message.innerHTML = "";
    paused = false;
    playPauseBtn.innerHTML = "Pause";
    lock = true;
    previewCards();
};
/* START GAME */
previewCards();