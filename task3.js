const board = document.getElementById("board");
const message = document.getElementById("message");
const resetButton = document.getElementById("resetButton");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
   
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function initializeBoard() {
    board.innerHTML = "";
    board.style.position = "relative"; // Ensures relative positioning for the line
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleCellClick);
        board.appendChild(cell);
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (gameState[index] !== "" || !gameActive) return;

    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    if (checkWinner()) {
        message.textContent = `Player ${currentPlayer} Wins!`;
        message.style.color = "green"; // Highlight the winner message in green
        gameActive = false;
    } else if (gameState.every(cell => cell !== "")) {
        message.textContent = "It's a Draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        message.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

function checkWinner() {
    const winCondition = winningConditions.find(condition => {
        const [a, b, c] = condition;
        return (
            gameState[a] === currentPlayer &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        );
    });

    if (winCondition) {
        drawWinningLine(winCondition);
        return true;
    }
    return false;
}

function drawWinningLine(winCondition) {
    const line = document.createElement("div");
    line.style.position = "absolute";
    line.style.height = "5px";
    line.style.backgroundColor = "green";
    line.style.borderRadius = "5px";
    line.style.transformOrigin = "left center";

    const cells = document.querySelectorAll(".cell");
    const firstCell = cells[winCondition[0]];
    const lastCell = cells[winCondition[2]];

    const firstCellRect = firstCell.getBoundingClientRect();
    const lastCellRect = lastCell.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const x1 = firstCellRect.left + firstCellRect.width / 2 - boardRect.left;
    const y1 = firstCellRect.top + firstCellRect.height / 2 - boardRect.top;
    const x2 = lastCellRect.left + lastCellRect.width / 2 - boardRect.left;
    const y2 = lastCellRect.top + lastCellRect.height / 2 - boardRect.top;

    // Calculate line length and angle
    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    line.style.width = `${length}px`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;
    line.style.transform = `rotate(${angle}deg)`;

    board.appendChild(line);
}

function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    message.textContent = `Player X's Turn`;
    message.style.color = "maroon"; // Reset message color

    const line = board.querySelector("div[style]");
    if (line) line.remove();

    initializeBoard();
}


resetButton.addEventListener("click", resetGame);

initializeBoard();
