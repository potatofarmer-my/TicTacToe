let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;

function drawBoard() {
    const boardDiv = document.getElementById('board');
    boardDiv.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        let cellValue = board[i] === null ? '' : board[i];
        boardDiv.innerHTML += `<div class="cell" onclick="makeMove(${i})">${cellValue}</div>`;
    }
}
drawBoard();

function makeMove(i) {
    if (board[i] === null) {
        board[i] = currentPlayer;
        drawBoard();
        if (checkWinner()) {
            setTimeout(() => {
                if (currentPlayer === 'X') {
                    showModal("NOOOOOOB!");
                } else {
                    showModal("Congratulations, you won!");
                }
                resetBoard();
            }, 100);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                makeComputerMove();
                currentPlayer = 'X';
            }
        }
    }
}

function evaluateBoard(board) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]  // diagonals
    ];

    for (let line of lines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === 'O' ? 1 : -1;
        }
    }

    return 0;
}

function minimax(board, depth, isMaximizing) {
    let score = evaluateBoard(board);
    if (score !== 0) return score;
    if (!board.includes(null)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (!board[i]) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function makeComputerMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    board[move] = 'O';
    drawBoard();
    if (checkWinner()) {
        setTimeout(() => {
            showModal("NOOOOOOB!");
            resetBoard();
        }, 200);
    }
}

function showModal(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal').style.display = "block";
    document.getElementById('modal-video').play();
}

function hideModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modal-video').pause();
}

document.getElementById('modal-button').onclick = function() {
    document.getElementById('modal').style.display = "none";
    let video = document.getElementById('modal-video');
    video.pause();
    resetBoard();
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            setTimeout(() => {
                if (board[a] === 'O') {
                    showModal("NOOOOOOB!");
                } else {
                    showModal("Congratulations, you won!");
                }
                gameOver = true; // Set gameOver to true
            }, 100);
            return true; // Return true if a winner is found
        }
    }

    if (!board.includes(null)) { // Remove the !gameOver condition
        setTimeout(() => {
            showModal("NOOOOOOB!");
            gameOver = true; // Set gameOver to true
        }, 100);
        return true; // Return true if the game is a draw
    }

    return false; // Return false if the game is not over
}

function resetBoard() {
    board = Array(9).fill(null);
    gameOver = false; // Reset gameOver to false
    drawBoard();

}

drawBoard();