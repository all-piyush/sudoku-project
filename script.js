function newpuzzle() {
  error = 0;
  numselected = null;
  board = Array.from({ length: 9 }, () => Array(9).fill(0));
  filldiagonal(board);
  solver(board, 0, 0);
  solution = board.map((row) => row.slice());
  remove(board, 40);
  document.getElementById("board").innerText="";
  document.getElementById("digits").innerText="";
  create();
}
window.onload = function () {
  newpuzzle();
};
function issafe(board, r, c, val) {
  for (let j = 0; j < 9; j++) {
    if (board[r][j] === val || board[j][c] === val) {
      return false;
    }
  }
  let sr = Math.floor(r / 3) * 3;
  let sc = Math.floor(c / 3) * 3;
  for (let i = sr; i < sr + 3; i++) {
    for (let j = sc; j < sc + 3; j++) {
      if (board[i][j] === val) {
        return false;
      }
    }
  }
  return true;
}
function solver(board, r, c) {
  if (r === 9) {
    return true;
  }
  if (c === 9) {
    return solver(board, r + 1, 0);
  }
  if (board[r][c] !== 0) {
    return solver(board, r, c + 1);
  }
  for (let i = 1; i <= 9; i++) {
    if (issafe(board, r, c, i)) {
      board[r][c] = i;
      let next = solver(board, r, c + 1);
      if (next) {
        return true;
      }
      board[r][c] = 0;
    }
  }
}
function filldiagonalbox(board, r, c) {
  let num = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
  let idx = 0;
  for (let i = r; i < r + 3; i++) {
    for (let j = c; j < c + 3; j++) {
      board[i][j] = num[idx++];
    }
  }
}
function filldiagonal(board) {
  for (let i = 0; i < 9; i = i + 3) {
    filldiagonalbox(board, i, i);
  }
}
function remove(board, x) {
  let count = 0;
  while (count < x) {
    let r = Math.floor(Math.random() * 9);
    let c = Math.floor(Math.random() * 9);
    if (board[r][c] !== 0) {
      board[r][c] = 0;
    }
    count++;
  }
}
function create() {
  for (let i = 1; i < 10; i++) {
    let number = document.createElement("div");
    number.id = i;
    number.innerText = i;
    number.addEventListener("click", num);
    number.classList.add("number");
    document.getElementById("digits").appendChild(number);
  }

  const boar = document.getElementById("board");
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let cell = document.createElement("div");
      cell.id = i.toString() + "-" + j.toString();
      if (board[i][j] !== 0) {
        cell.innerText = board[i][j];
        cell.classList.add("cell-start");
      }
      if (i === 2 || i === 5) {
        cell.classList.add("horizonal-line");
      }
      if (j === 2 || j === 5) {
        cell.classList.add("vertical-line");
      }
      cell.addEventListener("click", selcell);
      cell.classList.add("cell");
      boar.appendChild(cell);
    }
  }
  let ele = document.getElementById("hint");
  ele.addEventListener("click", diveHint);
}
function num() {
  if (numselected != null) numselected.classList.remove("number-selected");
  numselected = this;
  this.classList.add("number-selected");
}
function selcell() {
  if (numselected) {
    if (this.innerText != "" || this.classList.contains("right")) {
      return;
    }
    let cord = this.id.split("-");
    let r = parseInt(cord[0]);
    let c = parseInt(cord[1]); 
    this.innerText = numselected.id;
    board[r][c]=numselected.id;
    if (solution[r][c] == numselected.id) {
      this.classList.remove("wrong");
      this.classList.add("right");
    } else if (solution[r][c] != numselected.id) {
      error++;
      document.getElementById("error").innerText = "Errors: " + error;
      this.classList.add("wrong");
    }
    numselected.classList.remove("number-selected");
    numselected = null;
  } else {
    if (this.classList.contains("wrong")) {
      this.innerText = "";
      this.classList.remove("wrong");
      return;
    }
  }
  if (checkBoardComplete()) {
        setTimeout(() => {
            alert("Puzzle Solved! Generating new puzzle...");
            newpuzzle();
        }, 200);
    }
}

function diveHint() {
  let emptyTiles = [];

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      let tile = document.getElementById(`${r}-${c}`);
      if (!tile.classList.contains("cell-start") && tile.innerText === "") {
        emptyTiles.push([r, c]);
      }
    }
  }
  if (emptyTiles.length === 0) {
    return;
  }
  // Pick a random empty tile
  let [r, c] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
  let tile = document.getElementById(`${r}-${c}`);

  tile.innerText = solution[r][c];
  tile.classList.add("hint-taken", "right"); // Optional: style it
  board[r][c] = solution[r][c];
  if (checkBoardComplete()) {
        setTimeout(() => {
            alert("Puzzle Solved! Generating new puzzle...");
            newpuzzle();
        }, 200);
    }
}
function checkBoardComplete() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (board[r][c] !== solution[r][c]) {
                return false;
            }
        }
    }
    return true;
}