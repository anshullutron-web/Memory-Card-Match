const gameBoard = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");

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

/* Shuffle Cards */
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

/* Create Cards */
function createBoard() {
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

/* Flip Logic */
function flipCard() {
    if (lockBoard) return;
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

/* Update Score UI */
function updateScore() {
    scoreDisplay.textContent = score;
}

/* Reset Turn */
function resetTurn() {
    firstCard = null;
    secondCard = null;
    lockBoard = false;
}

/* Initialize Game */
createBoard();
