// src/features/algorithms/pathfinding/astar.js

export function astar(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  
  // 1. Initialize logic
  startNode.distance = 0;
  startNode.totalDistance = 0; // f = g + h
  
  // We need a list of unvisited nodes to sort
  const unvisitedNodes = getAllNodes(grid);

  while (!!unvisitedNodes.length) {
    // 2. Sort by "Total Distance" (f) instead of just "Distance" (g)
    // This is what makes A* "smart" - it looks at the heuristic!
    sortNodesByTotalDistance(unvisitedNodes);
    const closestNode = unvisitedNodes.shift();

    if (closestNode.isWall) continue;
    
    // If we are trapped
    if (closestNode.distance === Infinity) return visitedNodesInOrder;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    if (closestNode === finishNode) return visitedNodesInOrder;

    updateUnvisitedNeighbors(closestNode, grid, finishNode);
  }
}

// Sort by f = g + h (distance from start + estimated distance to finish)
function sortNodesByTotalDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.totalDistance - nodeB.totalDistance);
}

function updateUnvisitedNeighbors(node, grid, finishNode) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    // 1. Calculate new distance from start (g)
    const newDistance = node.distance + 1;
    
    // 2. Calculate heuristic distance to finish (h) - Manhattan Distance
    const heuristicDistance = Math.abs(neighbor.col - finishNode.col) + Math.abs(neighbor.row - finishNode.row);
    
    // 3. Update if we found a faster path
    if (newDistance < neighbor.distance) {
      neighbor.distance = newDistance;
      neighbor.totalDistance = newDistance + heuristicDistance; // f = g + h
      neighbor.previousNode = node;
    }
  }
}

function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}