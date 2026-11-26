// Minesweeper
// Left click: reveal a cell
// Right click (or Flag mode on touch screens): place / remove a flag
// Click a revealed number whose flags are all placed: reveal its neighbors

(function () {
    const DIFFICULTIES = {
        beginner:     { rows: 9,  cols: 9,  mines: 10 },
        intermediate: { rows: 16, cols: 16, mines: 40 },
        expert:       { rows: 16, cols: 30, mines: 99 },
    };

    const FACES = { playing: "🙂", pressed: "😮", won: "😎", lost: "😵" };

    let config = DIFFICULTIES.beginner;
    let board = [];          // 2D array of cell objects
    let firstClick = true;   // mines are placed after the first click so it is always safe
    let gameOver = false;
    let flagsPlaced = 0;
    let cellsRevealed = 0;
    let timer = null;
    let seconds = 0;
    let flagMode = false;

    // DOM elements (set in init)
    let gridEl, faceEl, mineCounterEl, timerEl, flagModeEl;

    function init() {
        const root = document.getElementById("minesweeper-game");
        if (!root) return;

        root.innerHTML = `
            <div class="ms-controls">
                <select id="ms-difficulty" aria-label="Difficulty">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                </select>
                <button id="ms-flag-mode" title="Toggle flag mode (for touch screens)">🚩 Off</button>
            </div>
            <div class="ms-frame">
                <div class="ms-header">
                    <div class="ms-display" id="ms-mines">000</div>
                    <button class="ms-face" id="ms-face" aria-label="New game">${FACES.playing}</button>
                    <div class="ms-display" id="ms-timer">000</div>
                </div>
                <div class="ms-grid" id="ms-grid"></div>
            </div>
        `;

        gridEl = document.getElementById("ms-grid");
        faceEl = document.getElementById("ms-face");
        mineCounterEl = document.getElementById("ms-mines");
        timerEl = document.getElementById("ms-timer");
        flagModeEl = document.getElementById("ms-flag-mode");

        document.getElementById("ms-difficulty").addEventListener("change", (e) => {
            config = DIFFICULTIES[e.target.value];
            newGame();
        });

        faceEl.addEventListener("click", newGame);

        flagModeEl.addEventListener("click", () => {
            flagMode = !flagMode;
            flagModeEl.textContent = flagMode ? "🚩 On" : "🚩 Off";
            flagModeEl.classList.toggle("active", flagMode);
        });

        // Board interaction (one set of listeners, delegated to cells)
        gridEl.addEventListener("contextmenu", (e) => e.preventDefault());

        gridEl.addEventListener("mousedown", (e) => {
            if (gameOver || e.button !== 0 || !e.target.classList.contains("ms-cell")) return;
            faceEl.textContent = FACES.pressed;
        });

        document.addEventListener("mouseup", () => {
            if (!gameOver && faceEl) faceEl.textContent = FACES.playing;
        });

        gridEl.addEventListener("mouseup", (e) => {
            const cell = getCellFromEvent(e);
            if (!cell || gameOver) return;

            if (e.button === 2 || (e.button === 0 && flagMode && !cell.revealed)) {
                toggleFlag(cell);
            } else if (e.button === 0) {
                if (cell.revealed) chord(cell);
                else reveal(cell);
                checkWin();
            }
        });

        newGame();
    }

    function getCellFromEvent(e) {
        const el = e.target.closest(".ms-cell");
        if (!el) return null;
        return board[+el.dataset.row][+el.dataset.col];
    }

    function newGame() {
        stopTimer();
        seconds = 0;
        firstClick = true;
        gameOver = false;
        flagsPlaced = 0;
        cellsRevealed = 0;
        board = [];

        faceEl.textContent = FACES.playing;
        gridEl.innerHTML = "";
        gridEl.style.gridTemplateColumns = `repeat(${config.cols}, var(--ms-cell-size))`;

        for (let r = 0; r < config.rows; r++) {
            const row = [];
            for (let c = 0; c < config.cols; c++) {
                const el = document.createElement("div");
                el.className = "ms-cell";
                el.dataset.row = r;
                el.dataset.col = c;
                gridEl.appendChild(el);
                row.push({ row: r, col: c, mine: false, revealed: false, flagged: false, adjacent: 0, el });
            }
            board.push(row);
        }

        updateMineCounter();
        updateTimer();
    }

    function placeMines(safeCell) {
        // Keep the first clicked cell and its neighbors free of mines
        const safe = new Set([safeCell, ...neighbors(safeCell)]);
        const candidates = board.flat().filter((cell) => !safe.has(cell));

        // Shuffle and take the first N
        for (let i = candidates.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }
        candidates.slice(0, config.mines).forEach((cell) => (cell.mine = true));

        board.flat().forEach((cell) => {
            cell.adjacent = neighbors(cell).filter((n) => n.mine).length;
        });
    }

    function neighbors(cell) {
        const result = [];
        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr === 0 && dc === 0) continue;
                const r = cell.row + dr;
                const c = cell.col + dc;
                if (r >= 0 && r < config.rows && c >= 0 && c < config.cols) {
                    result.push(board[r][c]);
                }
            }
        }
        return result;
    }

    function reveal(cell) {
        if (cell.revealed || cell.flagged) return;

        if (firstClick) {
            firstClick = false;
            placeMines(cell);
            startTimer();
        }

        if (cell.mine) {
            cell.el.classList.add("ms-exploded");
            loseGame();
            return;
        }

        // Flood fill from empty cells
        const stack = [cell];
        while (stack.length) {
            const current = stack.pop();
            if (current.revealed || current.flagged) continue;

            current.revealed = true;
            cellsRevealed++;
            current.el.classList.add("ms-revealed");

            if (current.adjacent > 0) {
                current.el.textContent = current.adjacent;
                current.el.classList.add("ms-n" + current.adjacent);
            } else {
                neighbors(current).forEach((n) => {
                    if (!n.revealed && !n.mine) stack.push(n);
                });
            }
        }
    }

    // Clicking a revealed number with the right number of flags around it reveals the rest
    function chord(cell) {
        if (cell.adjacent === 0) return;
        const around = neighbors(cell);
        const flags = around.filter((n) => n.flagged).length;
        if (flags !== cell.adjacent) return;
        around.forEach((n) => {
            if (!gameOver) reveal(n);
        });
    }

    function toggleFlag(cell) {
        if (cell.revealed) return;
        cell.flagged = !cell.flagged;
        flagsPlaced += cell.flagged ? 1 : -1;
        cell.el.textContent = cell.flagged ? "🚩" : "";
        cell.el.classList.toggle("ms-flagged", cell.flagged);
        updateMineCounter();
    }

    function checkWin() {
        if (gameOver) return;
        if (cellsRevealed === config.rows * config.cols - config.mines) {
            gameOver = true;
            stopTimer();
            faceEl.textContent = FACES.won;
            // Flag every remaining mine
            board.flat().forEach((cell) => {
                if (cell.mine && !cell.flagged) toggleFlag(cell);
            });
        }
    }

    function loseGame() {
        gameOver = true;
        stopTimer();
        faceEl.textContent = FACES.lost;
        board.flat().forEach((cell) => {
            if (cell.mine && !cell.flagged) {
                cell.el.textContent = "💣";
                cell.el.classList.add("ms-revealed");
            } else if (!cell.mine && cell.flagged) {
                cell.el.textContent = "❌";
                cell.el.classList.add("ms-revealed");
            }
        });
    }

    function startTimer() {
        stopTimer();
        timer = setInterval(() => {
            if (seconds < 999) seconds++;
            updateTimer();
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timer);
        timer = null;
    }

    function pad(n) {
        const sign = n < 0 ? "-" : "";
        return sign + String(Math.abs(n)).padStart(sign ? 2 : 3, "0");
    }

    function updateMineCounter() {
        mineCounterEl.textContent = pad(config.mines - flagsPlaced);
    }

    function updateTimer() {
        timerEl.textContent = pad(seconds);
    }

    document.addEventListener("DOMContentLoaded", init);
})();
