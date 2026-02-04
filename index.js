const gameBoard = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
const playPauseBtn = document.getElementById("playPauseBtn");
const restartBtn = document.getElementById("restartBtn");
const cardValues = [
    "🍎","🍎","🍌","🍌",
    "🍇","🍇","🍓","🍓",
    "🍒","🍒","🥝","🥝",
    "🍍","🍍","🍑","🍑"
];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let score = 0;
let isPaused = false;
/* Shuffle */
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}
/* Create Board */
function createBoard() {
    gameBoard.innerHTML = "";
    shuffle(cardValues);
    cardValues.forEach(value => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.value = value;
        card.innerHTML = `
            <div class="card-face card-front">${value}</div>
            <div class="card-face card-back"></div>
        `;
        card.addEventListener("click", flipCard);
        gameBoard.appendChild(card);
    });
}
/* Flip Card */
function flipCard() {
    if (lockBoard || isPaused) return;
    if (this === firstCard) return;
    this.classList.add("flip");
    if (!firstCard) {
        firstCard = this;
        return;
    }
    secondCard = this;
    lockBoard = true;
    checkMatch();
}
/* Match Check */
function checkMatch() {
    const isMatch =
        firstCard.dataset.value === secondCard.dataset.value;
    isMatch ? handleMatch() : handleMismatch();
}
/* Correct Match */
function handleMatch() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    score += 10;
    updateScore();
    matchedPairs++;
    resetTurn();
    if (matchedPairs === cardValues.length / 2) {
        setTimeout(() => {
            alert(`🎉 Game Completed!\nFinal Score: ${score}`);
        }, 500);
    }
}
/* Wrong Match */
function handleMismatch() {
    score = Math.max(0, score - 2);
    updateScore();
    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        resetTurn();
    }, 900);
}
/* Update Score */
function updateScore() {
    scoreDisplay.textContent = score;
}
/* Reset Turn */
function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}
/* Play or Pause */
playPauseBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    gameBoard.classList.toggle("paused", isPaused);
    playPauseBtn.textContent = isPaused ? "Play" : "Pause";
});
/* Restart */
restartBtn.addEventListener("click", () => {
    score = 0;
    matchedPairs = 0;
    isPaused = false;
    updateScore();
    playPauseBtn.textContent = "Pause";
    gameBoard.classList.remove("paused");
    resetTurn();
    createBoard();
});
createBoard();
