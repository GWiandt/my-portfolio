import React, { useState, useEffect, useRef } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "./dijkstra";
import { recursiveBacktracking } from "./maze";
import { astar } from "./astar";

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState([]);
  // NEW: State for tracking algorithm performance
  const [stats, setStats] = useState({ visited: 0, pathLength: 0, time: 0 });
  
  const isMouseDownRef = useRef(false);
  const isErasingRef = useRef(false);

  useEffect(() => {
    setGrid(getInitialGrid());
  }, []);

  const handleMouseDown = (row, col) => {
    const node = grid[row][col];
    if (node.isStart || node.isFinish) return;
    isMouseDownRef.current = true;
    isErasingRef.current = node.isWall;
    setGrid(prev => getUpdatedGrid(prev, row, col, !isErasingRef.current));
  };

  const handleMouseEnter = (row, col) => {
    if (!isMouseDownRef.current) return;
    setGrid(prevGrid => {
      const node = prevGrid[row][col];
      if (node.isStart || node.isFinish) return prevGrid;
      if (isErasingRef.current && node.isWall) return getUpdatedGrid(prevGrid, row, col, false);
      else if (!isErasingRef.current && !node.isWall) return getUpdatedGrid(prevGrid, row, col, true);
      return prevGrid;
    });
  };

  const handleMouseUp = () => { isMouseDownRef.current = false; };

  const generateMaze = () => {
    // Reset stats when generating a new maze
    setStats({ visited: 0, pathLength: 0, time: 0 });
    const initialGrid = getInitialGrid();
    setGrid(initialGrid.map(row => row.map(node => ({ ...node, isWall: !node.isStart && !node.isFinish }))));
    const path = recursiveBacktracking(initialGrid, initialGrid[START_NODE_ROW][START_NODE_COL], initialGrid[FINISH_NODE_ROW][FINISH_NODE_COL]);
    for (let i = 0; i < path.length; i++) {
      setTimeout(() => {
        setGrid(prev => {
          const newGrid = [...prev];
          const node = path[i];
          newGrid[node.row] = [...newGrid[node.row]];
          newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isWall: false };
          return newGrid;
        });
      }, 5 * i);
    }
  };

  // --- Algorithm Execution Wrapper ---
  const runAlgorithm = (algoName) => {
    const gridClone = grid.map(row => row.map(node => ({...node})));
    const startNode = gridClone[START_NODE_ROW][START_NODE_COL];
    const finishNode = gridClone[FINISH_NODE_ROW][FINISH_NODE_COL];
    
    // Performance benchmarking start
    const startTime = performance.now();
    
    let visitedNodesInOrder;
    if (algoName === "dijkstra") {
      visitedNodesInOrder = dijkstra(gridClone, startNode, finishNode);
    } else if (algoName === "astar") {
      visitedNodesInOrder = astar(gridClone, startNode, finishNode);
    }
    
    const endTime = performance.now();
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    
    // Update Stats
    setStats({
      visited: visitedNodesInOrder.length,
      pathLength: nodesInShortestPathOrder.length,
      time: (endTime - startTime).toFixed(2)
    });

    animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const animateAlgorithm = (visitedNodes, shortestPath) => {
    for (let i = 0; i <= visitedNodes.length; i++) {
      if (i === visitedNodes.length) {
        setTimeout(() => animateShortestPath(shortestPath), 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodes[i];
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el && !node.isStart && !node.isFinish) el.className = "node node-visited";
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      setTimeout(() => {
        const el = document.getElementById(`node-${nodes[i].row}-${nodes[i].col}`);
        if (el && !nodes[i].isStart && !nodes[i].isFinish) el.className = "node node-shortest-path";
      }, 50 * i);
    }
  };

  const clearPathOnly = () => {
    setStats({ visited: 0, pathLength: 0, time: 0 });
    const newGrid = grid.map(row => row.map(node => {
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el && !node.isStart && !node.isFinish && !node.isWall) el.className = "node"; 
        return { ...node, distance: Infinity, totalDistance: Infinity, isVisited: false, previousNode: null };
      })
    );
    setGrid(newGrid);
  };

  return (
    <div className="flex flex-col items-center py-10 min-h-screen bg-[#0a0a0a]" onMouseUp={handleMouseUp}>
      <div className="text-center mb-8 w-full max-w-4xl">
        <h1 className="text-4xl font-black text-white tracking-tight mb-2 uppercase italic">
          Algorithm <span className="text-blue-500">Visualizer</span>
        </h1>
        
        {/* NEW: Stats Dashboard */}
        <div className="flex justify-center gap-8 mb-6 text-zinc-400 font-mono text-sm bg-zinc-900/50 py-2 rounded-lg border border-white/5">
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase font-bold text-zinc-500">Nodes Visited</span>
            <span className="text-xl text-white font-bold">{stats.visited}</span>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase font-bold text-zinc-500">Path Cost</span>
            <span className="text-xl text-blue-400 font-bold">{stats.pathLength}</span>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase font-bold text-zinc-500">Time (ms)</span>
            <span className="text-xl text-green-400 font-bold">{stats.time}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center mb-6">
          <button onClick={() => runAlgorithm("dijkstra")} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20">
            Run Dijkstra
          </button>
          <button onClick={() => runAlgorithm("astar")} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-green-500/20">
            Run A*
          </button>
          <button onClick={generateMaze} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-purple-500/20">
            Generate Maze
          </button>
          <button onClick={clearPathOnly} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg transition-all">
            Clear Path
          </button>
          <button onClick={() => window.location.reload()} className="px-6 py-2 border border-zinc-700 text-zinc-500 hover:text-white font-bold rounded-lg transition-all">
            Reset Everything
          </button>
        </div>
      </div>

      <div className="inline-block bg-[#020617] p-1 rounded-xl border border-white/5 shadow-2xl overflow-hidden" onMouseLeave={handleMouseUp}>
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((node, nodeIdx) => (
              <Node key={nodeIdx} {...node} onMouseDown={() => handleMouseDown(node.row, node.col)} onMouseEnter={() => handleMouseEnter(node.row, node.col)} onMouseUp={handleMouseUp} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Helpers ---
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => ({
  col, row,
  isStart: row === START_NODE_ROW && col === START_NODE_COL,
  isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
  distance: Infinity,
  totalDistance: Infinity,
  isVisited: false,
  isWall: false,
  previousNode: null,
});

const getUpdatedGrid = (grid, row, col, wallStatus) => {
  const newGrid = [...grid];
  newGrid[row] = [...newGrid[row]];
  newGrid[row][col] = { ...newGrid[row][col], isWall: wallStatus };
  return newGrid;
};

export default PathfindingVisualizer;