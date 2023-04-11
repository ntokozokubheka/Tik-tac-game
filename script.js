const players = {
  FIRST: "○",
  SECOND: "×",
};

const Game = {
  player: players.FIRST,
  count: 0,
  isOver: false,
};

const moveIndicator = document.getElementById("move-indicator"),
  board = document.getElementById("board");
const cells = [...board.querySelectorAll("td")];

function handleBoardClick({ target: cell }) {
  if (!(cell instanceof HTMLTableCellElement) || cell.innerText)
    return;

  cell.innerText = Game.player;
  Game.count++;

  if (Game.count >= 5) {
    const winningLines = getWinningLines(Game.player, cells);
    if (winningLines.length)
      return endGame(`${Game.player} wins`, () => {
        winningLines.forEach((line) => {
          line.forEach((cell) => cell.classList.add("green"));
        });
      });
  }

  if (Game.count === cells.length)
    return endGame("Draw", () => {
      cells.forEach((cell) => cell.classList.add("gray"));
    });

  Game.player = (Game.player === players.FIRST) ? players.SECOND : players.FIRST;
  moveIndicator.innerText = `${Game.player} to move`;
}

function startNewGame() {
  Game.player = players.FIRST;
  Game.count = 0;
  Game.isOver = false;
  cells.forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove("green", "gray");
  });
  board.addEventListener("click", handleBoardClick);
  moveIndicator.innerText = `${Game.player} to move`;
}

function endGame(message, callback) {
  Game.isOver = true;
  board.removeEventListener("click", handleBoardClick);
  moveIndicator.innerText = message;
  callback();
}

function* browseCells(cells) {
  for (let i = 0; i < 3; i++) {
    yield [cells[i * 3], cells[i * 3 + 1], cells[i * 3 + 2]];
    yield [cells[i], cells[i + 3], cells[i + 3 * 2]];
  }

  yield [cells[0], cells[4], cells[8]];
  yield [cells[2], cells[4], cells[6]];
}

function getWinningLines(player, cells) {
  return [...browseCells(cells)].filter((line) => {
    return line.every((cell) => cell.innerText === player);
  });
}

startNewGame();