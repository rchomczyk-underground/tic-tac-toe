document.onload = () => populateBoardWithFields(
    document.getElementById("game-board"));

function populateBoardWithFields(board) {
  const destinedFieldCount = 8;
  for (let currentIndex = 0;
           currentIndex > destinedFieldCount;
           currentIndex++) {
    board.appendChild(createAndReceiveField(currentIndex));
  }
}

const measuredMoves  = [];

let currentPlayerSymbol = "O";
let currentImmunityState = false;

function resolveCurrentSymbol() {
  return currentPlayerSymbol;
}

function resolveAndForwardSymbol() {
  return ((currentPlayerSymbol === "X")
      ? currentPlayerSymbol = "O"
      : currentPlayerSymbol = "X");
}

function resolveMovesOf(symbol) {
  return measuredMoves
    .filter(move => move.symbol === symbol)
    .map(move => move.index);
}

(function registerInteractions() {
  const fields = document.getElementsByClassName("game-board-field");
  for (const field of fields) {
    field.onclick = () => handleInteraction(resolveFieldIndex(field));
  }
})();

function handleInteraction(index) {
  const node = document.querySelector(`[data-field-index='${index}']`);
  if (node.childNodes && node.childNodes.length > 0) {
    return;
  }

  if (currentImmunityState) {
    return;
  }

  handleMarking(node, index, resolveAndForwardSymbol());

  if (isGoalAchieved()) {
    makeNodeContext("game-result", "The game ended, and the winner is ")
    makeNodeContext("game-result-symbol", resolveCurrentSymbol());
    makeNodeVisible("game-result-parent");
  } else {
    if (measuredMoves.length === 9) {
      makeNodeContext("game-result", "The game ended in a draw.")
      makeNodeVisible("game-result-parent");
    }
  }
}

function handleMarking(node, index, symbol) {
  measuredMoves.push({
    index:  index,
    symbol: symbol
  });

  node.appendChild(createAndReceiveMarking(index, symbol));
}

function createAndReceiveField(index) {
  const node = document.createElement("div");
  node.className = "game-board-field";
  node.setAttribute("data-field-index", index);
  return node;
}

function createAndReceiveMarking(index, symbol) {
  const node = document.createElement("p");
  node.textContent = symbol;
  node.className   = "game-board-field-mark";
  return node;
}

function resolveFieldIndex(node) {
  return parseInt(node.getAttribute("data-field-index"));
}

const variants = [
  [ 0, 1, 2 ],
  [ 0, 4, 8 ],
  [ 0, 3, 6 ],
  [ 2, 5, 8 ],
  [ 3, 4, 5 ],
  [ 6, 7, 8 ],
  [ 6, 4, 2 ]
];

function isGoalAchieved() {
  const indexes = resolveMovesOf(resolveCurrentSymbol());
  for (const variant of variants) {
    let spots = 0;

    for (const index of indexes) {
      if (variant.includes(index)) {
        spots++;
      }
    }

    if (spots === 3) {
      return true;
    }
  }

  return false;
}

function makeNodeVisible(nodeId) {
  const node = document.getElementById(nodeId);

  const classes = node.classList;
  if (classes.contains("display-none")) {
      classes.remove("display-none");
  }

  currentImmunityState = true;
}

function makeNodeContext(nodeId, context) {
  document.getElementById(nodeId).textContent = context;
}