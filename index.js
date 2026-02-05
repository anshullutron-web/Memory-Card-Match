/* GET HTML ELEMENTS */
var gameBoard = document.getElementById("gameBoard");
var timerText = document.getElementById("timer");
var message = document.getElementById("gameMessage");
var playPauseBtn = document.getElementById("playPauseBtn");
var restartBtn = document.getElementById("restartBtn");
/* TIME VARIABLES */
var timeTaken = 0;
var timer;
/* GAME VARIABLES */
var firstCard = null;
var secondCard = null;
var lock = true;
var paused = false;
var matched = 0;
var gameOver = false;
/* CARD VALUES */
var cardsData = [
    "🍎","🍎","🍌","🍌",
    "🍇","🍇","🍓","🍓",
    "🍒","🍒","🥝","🥝",
    "🍍","🍍","🍑","🍑"
];
/* SHUFFLE FUNCTION */
function shuffle(array) {
    var i, j, temp;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
/* CREATE GAME BOARD */
function createBoard(values) {
    var i, card;
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
    var previewArray = cardsData.slice();
    shuffle(previewArray);
    createBoard(previewArray);
    var cards = document.getElementsByClassName("card");
    var i;
    for (i = 0; i < cards.length; i++) {
        cards[i].classList.add("flip");
    }
    lock = true;
    gameOver = false;
    setTimeout(startGame, 3000);
}
/* START GAME */
function startGame() {
    var gameArray = cardsData.slice();
    shuffle(gameArray);
    createBoard(gameArray);
    timeTaken = 0;
    timerText.innerHTML = timeTaken;
    lock = false;
    matched = 0;
    startTimer();
}
/* TIMER */
function startTimer() {
    clearInterval(timer);
    timer = setInterval(function () {
        if (paused === false && gameOver === false) {
            timeTaken = timeTaken + 1;
            timerText.innerHTML = timeTaken;
        }
    }, 1000);
}
/* FLIP CARD */
function flipCard() {
    if (lock === true) return;
    if (paused === true) return;
    if (gameOver === true) return;
    if (this === firstCard) return;
    if (this.classList.contains("matched")) return;
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
            endGame();
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
function endGame() {
    clearInterval(timer);
    gameOver = true;
    lock = true;
    message.innerHTML = "🎉 You won in " + timeTaken + " seconds!";
}
/* PLAY or PAUSE */
playPauseBtn.onclick = function () {
    if (paused === false) {
        paused = true;
        playPauseBtn.innerHTML = "Play";
    } else {
        paused = false;
        playPauseBtn.innerHTML = "Pause";
    }
};
/* RESTART */
restartBtn.onclick = function () {
    clearInterval(timer);
    paused = false;
    playPauseBtn.innerHTML = "Pause";
    message.innerHTML = "";
    lock = true;
    previewCards();
};
/* START GAME */
previewCards();