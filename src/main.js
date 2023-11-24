document.addEventListener("DOMContentLoaded", () => {
  const chessboard = document.getElementById("chessboard");
  const clearBtn = document.getElementById("clearBtn");
  const output = document.getElementById("output");

  let startCell = null;
  let endCell = null;

  const knightMoves = [
    [-2, -1], [-2, 1], [-1, -2], [-1, 2],
    [1, -2], [1, 2], [2, -1], [2, 1]
  ];

  const markPath = (path) => {
    path.forEach(({ row, col }, index) => {
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
      cell.classList.add("path");
      const moveNumber = document.createElement("div");
      moveNumber.textContent = index;
      moveNumber.classList.add("move-number");
      cell.appendChild(moveNumber);
    });
  };

  const findShortestPath = (start, end) => {
    const queue = [{ path: [start], visited: new Set([`${start.row},${start.col}`]) }];

    while (queue.length > 0) {
      const { path, visited } = queue.shift();
      const current = path[path.length - 1];

      if (current.row === end.row && current.col === end.col) {
        markPath(path);
        return;
      }

      for (const [rowDiff, colDiff] of knightMoves) {
        const nextRow = current.row + rowDiff;
        const nextCol = current.col + colDiff;

        if (nextRow >= 0 && nextRow < 8 && nextCol >= 0 && nextCol < 8) {
          const newPosition = `${nextRow},${nextCol}`;
          if (!visited.has(newPosition)) {
            const newPath = [...path, { row: nextRow, col: nextCol }];
            const newVisited = new Set(visited);
            newVisited.add(newPosition);
            queue.push({ path: newPath, visited: newVisited });
          }
        }
      }
    }
  };

  const clearBoard = () => {
    output.textContent = "";
    const pathCells = document.querySelectorAll(".path");
    pathCells.forEach(cell => cell.classList.remove("path"));
    const moveNumbers = document.querySelectorAll(".move-number");
    moveNumbers.forEach(number => number.remove());
    startCell = null;
    endCell = null;
  };

  const updateHoverStyles = () => {
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.classList.remove("start-hover", "end-hover"));

    if (startCell !== null) {
      const startCellElement = document.querySelector(`.cell[data-row="${startCell.row}"][data-col="${startCell.col}"]`);
      startCellElement.classList.add("start-hover");
    }

    if (endCell !== null) {
      const endCellElement = document.querySelector(`.cell[data-row="${endCell.row}"][data-col="${endCell.col}"]`);
      endCellElement.classList.add("end-hover");
    }
  };

  clearBtn.addEventListener("click", () => {
    clearBoard();
    updateHoverStyles();
  });

  chessboard.addEventListener("mousedown", (event) => {
    const clickedCell = event.target;
    const clickedRow = parseInt(clickedCell.dataset.row);
    const clickedCol = parseInt(clickedCell.dataset.col);

    if (event.button === 0 || event.button === 2) {
      const isLeftClick = event.button === 0;

      if (isLeftClick) {
        clearBoard();
        startCell = { row: clickedRow, col: clickedCol };
        output.textContent = `Start position set to (${startCell.row}, ${startCell.col})`;
      } else {
        endCell = { row: clickedRow, col: clickedCol };
        output.textContent = `End position set to (${endCell.row}, ${endCell.col})`;
        if (startCell !== null) {
          findShortestPath(startCell, endCell);
        }
      }

      updateHoverStyles();
    }
  });

  chessboard.addEventListener("mouseover", (event) => {
    const hoveredCell = event.target;
    const isStartHover = hoveredCell.classList.contains("start-hover");
    const isEndHover = hoveredCell.classList.contains("end-hover");

    if (!isStartHover && !isEndHover) {
      hoveredCell.classList.add("hover");
    }
  });

  chessboard.addEventListener("mouseout", (event) => {
    const hoveredCell = event.target;
    hoveredCell.classList.remove("hover");
  });


  // Prevent context menu on right-click
  chessboard.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

  // Create the chessboard
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell", (row + col) % 2 === 0 ? "even" : "odd");
      cell.dataset.row = row;
      cell.dataset.col = col;
      chessboard.appendChild(cell);
    }
  }
});