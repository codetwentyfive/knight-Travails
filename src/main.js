document.addEventListener("DOMContentLoaded", () => {
  const chessboard = document.getElementById("chessboard");
  const startBtn = document.getElementById("startBtn");
  const endBtn = document.getElementById("endBtn");
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

  startBtn.addEventListener("click", () => {
    output.textContent = "";
    startCell = null;
    clear();
  });

  endBtn.addEventListener("click", () => {
    output.textContent = "";
    endCell = null;
  });


  function clear (){
    output.textContent = "";
    const pathCells = document.querySelectorAll(".path");
    pathCells.forEach(cell => cell.classList.remove("path"));
    const moveNumbers = document.querySelectorAll(".move-number");
    moveNumbers.forEach(number => number.remove());
    startCell = null;
    endCell = null;
  };

  clearBtn.addEventListener("click", () => {
    clear();
  });

  chessboard.addEventListener("click", (event) => {
    const clickedCell = event.target;
    if (clickedCell.classList.contains("cell")) {
      const clickedRow = parseInt(clickedCell.dataset.row);
      const clickedCol = parseInt(clickedCell.dataset.col);

      if (startCell === null) {
        startCell = { row: clickedRow, col: clickedCol };
        output.textContent = `Start position set to (${startCell.row}, ${startCell.col})`;
      } else if (endCell === null) {
        endCell = { row: clickedRow, col: clickedCol };
        output.textContent = `End position set to (${endCell.row}, ${endCell.col})`;
        findShortestPath(startCell, endCell);
      }
    }
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