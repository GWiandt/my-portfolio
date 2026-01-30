// src/features/algorithms/pathfinding/maze.js

export function recursiveBacktracking(grid, startNode, finishNode) {
  const path = [];
  const visited = new Set();
  
  // 1. Initial State: Fill everything with walls
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (!grid[row][col].isStart && !grid[row][col].isFinish) {
        grid[row][col].isWall = true;
      }
    }
  }

  // 2. Carve a path starting from the start node
  function carve(row, col) {
    visited.add(`${row}-${col}`);
    
    // Define neighbors that are 2 steps away
    const directions = [
      [row - 2, col],
      [row + 2, col],
      [row, col - 2],
      [row, col + 2]
    ];
    
    // Shuffle directions for a unique maze every time
    directions.sort(() => Math.random() - 0.5);

    for (const [nRow, nCol] of directions) {
      if (
        nRow >= 0 && nRow < grid.length && 
        nCol >= 0 && nCol < grid[0].length && 
        !visited.has(`${nRow}-${nCol}`)
      ) {
        // Carve the mid-node between current and target
        const midRow = (row + nRow) / 2;
        const midCol = (col + nCol) / 2;
        
        if (!grid[midRow][midCol].isStart && !grid[midRow][midCol].isFinish) {
          grid[midRow][midCol].isWall = false;
          path.push(grid[midRow][midCol]);
        }
        
        if (!grid[nRow][nCol].isStart && !grid[nRow][nCol].isFinish) {
          grid[nRow][nCol].isWall = false;
          path.push(grid[nRow][nCol]);
        }
        
        carve(nRow, nCol);
      }
    }
  }

  carve(startNode.row, startNode.col);
  return path;
}