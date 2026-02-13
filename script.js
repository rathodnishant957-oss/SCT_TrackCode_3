const boardElement = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");
const pvpBtn = document.getElementById("pvpBtn");
const aiBtn = document.getElementById("aiBtn");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;
let vsComputer = false;

const winningCombinations = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
];


function createBoard() {
    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.index = index;
        cellElement.innerText = cell;
        cellElement.addEventListener("click", handleClick);
        boardElement.appendChild(cellElement);
    });
}


function handleClick(e) {
    const index = e.target.dataset.index;

    if (!gameActive || board[index] !== "") return;

    makeMove(index, currentPlayer);

    if (checkWinner()) return;

    if (vsComputer && currentPlayer === "O") {
        setTimeout(computerMove, 400);
    }
}

function makeMove(index, player) {
    board[index] = player;
    createBoard();
    currentPlayer = player === "X" ? "O" : "X";
    statusText.innerText = `Player ${currentPlayer}'s Turn`;
}


function computerMove() {
    let emptyCells = board
        .map((val, idx) => val === "" ? idx : null)
        .filter(val => val !== null);

    if (emptyCells.length === 0) return;

    let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    makeMove(randomIndex, "O");
    checkWinner();
}


function checkWinner() {
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWinner(combo);
            statusText.innerText = `🎉 Player ${board[a]} Wins!`;
            gameActive = false;
            return true;
        }
    }

    if (!board.includes("")) {
        statusText.innerText = "😮 It's a Draw!";
        gameActive = false;
        return true;
    }

    return false;
}

function highlightWinner(combo) {
    const cells = document.querySelectorAll(".cell");
    combo.forEach(index => {
        cells[index].classList.add("winner");
    });
}


function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    statusText.innerText = `Player ${currentPlayer}'s Turn`;
    createBoard();
}


pvpBtn.addEventListener("click", () => {
    vsComputer = false;
    resetGame();
});

aiBtn.addEventListener("click", () => {
    vsComputer = true;
    resetGame();
});

restartBtn.addEventListener("click", resetGame);


createBoard();
