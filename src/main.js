class Chessboard {
    constructor() {
      this.size = 8;
      this.board = Array.from({ length: this.size }, () =>
        Array(this.size).fill(0)
      );
    }
  
    isValidMove(x, y) {
      return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }
  
    getNeighbors(x, y) {
      const possibleMoves = [
        [x + 1, y + 2],
        [x + 2, y + 1],
        [x + 2, y - 1],
        [x + 1, y - 2],
        [x - 1, y - 2],
        [x - 2, y - 1],
        [x - 2, y + 1],
        [x - 1, y + 2],
      ];
  
      return possibleMoves.filter(([i, j]) => this.isValidMove(i, j));
    }
  }
  
  function knightTravails(start, end) {
    const chessboard = new Chessboard();
    const queue = [[start, [start]]];
  
    while (queue.length > 0) {
      const [current, path] = queue.shift();
  
      if (JSON.stringify(current) === JSON.stringify(end)) {
        return path;
      }
  
      for (const neighbor of chessboard.getNeighbors(...current)) {
        const [i, j] = neighbor;
        if (chessboard.board[i][j] === 0) {
          chessboard.board[i][j] = 1;
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }
  
    return null;
  }
  
  // Example usage:
  const startPosition = [0, 0];
  const endPosition = [7, 7];
  const result = knightTravails(startPosition, endPosition);
  
  if (result) {
    console.log(`Shortest path from ${startPosition} to ${endPosition}:`);
    console.log(result);
  } else {
    console.log("No valid path found.");
  }
  