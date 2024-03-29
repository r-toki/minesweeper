const board = document.getElementById("board");

const width = 15;
const height = 15;
const bombAmount = 5;

let initialized = false;

function createBoard() {
  for (let i = 0; i < height; i++) {
    const column = document.createElement("div");
    column.classList.add("column");

    board.appendChild(column);

    for (let j = 0; j < width; j++) {
      const square = document.createElement("div");
      square.classList.add("square", "hidden");
      square.id = `${i}-${j}`;
      column.appendChild(square);
      square.addEventListener("click", function () {
        handleClick(i, j);
      });
    }
  }
}

function setBomb() {
  const bombArray = getBombArray();
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const square = document.getElementById(`${i}-${j}`);
      if (square.classList.contains("blocked")) {
        square.classList.remove("blocked");
      } else {
        if (bombArray.pop() == "bomb") {
          square.classList.add("bomb");
          const text = document.createTextNode("X");
          square.appendChild(text);
        }
      }
    }
  }
}

function setBombAmount() {
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const square = document.getElementById(`${i}-${j}`);
      const bombAmountAround = getBombAmountAround(i, j);
      if (!square.classList.contains("bomb") && bombAmountAround > 0) {
        square.classList.add("danger");
        const text = document.createTextNode(bombAmountAround);
        square.appendChild(text);
      }
    }
  }
}

function blockAround(i, j) {
  for (let neighborI = i - 1; neighborI <= i + 1; neighborI++) {
    for (let neighborJ = j - 1; neighborJ <= j + 1; neighborJ++) {
      const square = document.getElementById(`${neighborI}-${neighborJ}`);
      if (square) {
        square.classList.add("blocked");
      }
    }
  }
}

function getBombArray() {
  const blockAmount = document.getElementsByClassName("blocked").length;
  const onlyBombArray = new Array(bombAmount).fill("bomb");
  const onlyEmptyArray = new Array(width * height - bombAmount - blockAmount).fill("empty");
  const concattedArray = onlyBombArray.concat(onlyEmptyArray);
  const bombArray = _.shuffle(concattedArray);
  return bombArray;
}

function getBombAmountAround(i, j) {
  let bombAmountAround = 0;
  for (let neighborI = i - 1; neighborI <= i + 1; neighborI++) {
    for (let neighborJ = j - 1; neighborJ <= j + 1; neighborJ++) {
      const isSelf = i == neighborI && j == neighborJ;
      const neighborSquare = document.getElementById(`${neighborI}-${neighborJ}`);
      if (!isSelf && neighborSquare && neighborSquare.classList.contains("bomb")) {
        bombAmountAround += 1;
      }
    }
  }
  return bombAmountAround;
}

function handleClick(i, j) {
  if (initialized) {
    click(i, j);
  } else {
    firstClick(i, j);
  }
}

function click(i, j) {
  const square = document.getElementById(`${i}-${j}`);
  if (square.classList.contains("bomb")) {
    window.alert("BOMB!");
    openAll();
    return;
  }
  sweep(i, j);

  if (
    document.getElementsByClassName("bomb").length ==
    document.getElementsByClassName("hidden").length
  ) {
    window.alert("CLEAR!");
    openAll();
    return;
  }
}

function firstClick(i, j) {
  blockAround(i, j);
  setBomb();
  setBombAmount();
  sweep(i, j);
  initialized = true;
}

function sweep(i, j) {
  const square = document.getElementById(`${i}-${j}`);
  if (!square || square.classList.contains("open")) {
    return;
  }
  square.classList.remove("hidden");
  square.classList.add("open");
  if (square.classList.contains("danger")) {
    return;
  }

  for (let neighborI = i - 1; neighborI <= i + 1; neighborI++) {
    for (let neighborJ = j - 1; neighborJ <= j + 1; neighborJ++) {
      const isSelf = i == neighborI && j == neighborJ;
      const neighborSquare = document.getElementById(`${neighborI}-${neighborJ}`);
      if (!isSelf && neighborSquare) {
        sweep(neighborI, neighborJ);
      }
    }
  }
}

function openAll() {
  const squares = Array.from(document.getElementsByClassName("square"));
  for (const square of squares) {
    square.classList.remove("hidden", "flag");
    square.classList.add("open");
  }
}

function createContextMenu() {
  $.contextMenu({
    selector: ".square",
    callback: function (key, options) {
      const square = options.$trigger[0];
      if (key == "addFlag") {
        square.classList.add("flag");
      } else if (key == "removeFlag") {
        square.classList.remove("flag");
      }
    },
    items: {
      addFlag: { name: "フラグを立てる" },
      removeFlag: { name: "フラグを回収する" },
    },
  });
}

function main() {
  createBoard();
  createContextMenu();
}

main();
