import React, { useState, useEffect, useRef } from "react";
import Node from "./Node/Node";
import { dijkstra, getNodesInShortestPathOrder } from "./dijkstra";
import { recursiveBacktracking } from "./maze";
import { astar } from "./astar";

const PathfindingVisualizer = () => {
  // DYNAMIC GRID STATE
  const [grid, setGrid] = useState([]);
  const [gridConfig, setGridConfig] = useState({
      ROWS: 20,
      COLS: 50,
      START_ROW: 10,
      START_COL: 15,
      FINISH_ROW: 10,
      FINISH_COL: 35,
      NODE_SIZE: 25 // Default desktop size
  });

  const [stats, setStats] = useState({ visited: 0, pathLength: 0, time: 0 });
  const isMouseDownRef = useRef(false);
  const isErasingRef = useRef(false);

  // --- 1. DETECT SCREEN SIZE ON LOAD ---
  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth < 768) {
            // MOBILE SETTINGS
            setGridConfig({
                ROWS: 20,
                COLS: 15, // Fewer columns to fit phone width
                START_ROW: 2,
                START_COL: 2,
                FINISH_ROW: 18,
                FINISH_COL: 12,
                NODE_SIZE: 18 // Slightly smaller squares
            });
        } else {
            // DESKTOP SETTINGS (Original)
            setGridConfig({
                ROWS: 20,
                COLS: 50,
                START_ROW: 10,
                START_COL: 15,
                FINISH_ROW: 10,
                FINISH_COL: 35,
                NODE_SIZE: 25
            });
        }
    };

    handleResize(); // Run immediately
  }, []);

  // --- 2. REBUILD GRID WHEN CONFIG CHANGES ---
  useEffect(() => {
    const initialGrid = getInitialGrid(gridConfig);
    setGrid(initialGrid);
  }, [gridConfig]);

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
    setStats({ visited: 0, pathLength: 0, time: 0 });
    // Reset grid but keep walls off for now
    const cleanGrid = getInitialGrid(gridConfig);
    
    // Set all as walls first (except start/finish)
    const mazeGrid = cleanGrid.map(row => row.map(node => ({ 
        ...node, 
        isWall: !node.isStart && !node.isFinish 
    })));
    setGrid(mazeGrid);

    // Pass config to maze generator if needed, or just use grid bounds
    const path = recursiveBacktracking(mazeGrid, mazeGrid[gridConfig.START_ROW][gridConfig.START_COL], mazeGrid[gridConfig.FINISH_ROW][gridConfig.FINISH_COL]);
    
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

  const runAlgorithm = (algoName) => {
    const gridClone = grid.map(row => row.map(node => ({...node})));
    const startNode = gridClone[gridConfig.START_ROW][gridConfig.START_COL];
    const finishNode = gridClone[gridConfig.FINISH_ROW][gridConfig.FINISH_COL];
    
    const startTime = performance.now();
    
    let visitedNodesInOrder;
    if (algoName === "dijkstra") {
      visitedNodesInOrder = dijkstra(gridClone, startNode, finishNode);
    } else if (algoName === "astar") {
      visitedNodesInOrder = astar(gridClone, startNode, finishNode);
    }
    
    const endTime = performance.now();
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    
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
    <div className="flex flex-col items-center py-6 min-h-screen bg-[#0a0a0a] pt-24" onMouseUp={handleMouseUp}>
      
      {/* Styles to force node size based on screen */}
      <style>{`
        .node {
            width: ${gridConfig.NODE_SIZE}px !important;
            height: ${gridConfig.NODE_SIZE}px !important;
        }
      `}</style>

      <div className="text-center mb-6 w-full max-w-4xl px-4">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2 uppercase italic">
          Algorithm <span className="text-blue-500">Visualizer</span>
        </h1>
        
        {/* Stats Dashboard */}
        <div className="flex justify-center gap-4 md:gap-8 mb-6 text-zinc-400 font-mono text-xs md:text-sm bg-zinc-900/50 py-2 rounded-lg border border-white/5">
          <div className="flex flex-col items-center px-2">
            <span className="text-[10px] md:text-xs uppercase font-bold text-zinc-500">Nodes Visited</span>
            <span className="text-lg md:text-xl text-white font-bold">{stats.visited}</span>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="flex flex-col items-center px-2">
            <span className="text-[10px] md:text-xs uppercase font-bold text-zinc-500">Path Cost</span>
            <span className="text-lg md:text-xl text-blue-400 font-bold">{stats.pathLength}</span>
          </div>
          <div className="w-px bg-white/10"></div>
          <div className="flex flex-col items-center px-2">
            <span className="text-[10px] md:text-xs uppercase font-bold text-zinc-500">Time (ms)</span>
            <span className="text-lg md:text-xl text-green-400 font-bold">{stats.time}</span>
          </div>
        </div>
        
        {/* Controls - Flex wrap for mobile */}
        <div className="flex flex-wrap gap-2 md:gap-4 justify-center mb-6">
          <button onClick={() => runAlgorithm("dijkstra")} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-sm shadow-lg shadow-blue-500/20">
            Dijkstra
          </button>
          <button onClick={() => runAlgorithm("astar")} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-sm shadow-lg shadow-green-500/20">
            A*
          </button>
          <button onClick={generateMaze} className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-sm shadow-lg shadow-purple-500/20">
            Maze
          </button>
          <button onClick={clearPathOnly} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg text-sm">
            Clear Path
          </button>
          <button onClick={() => window.location.reload()} className="px-4 py-2 border border-zinc-700 text-zinc-500 hover:text-white font-bold rounded-lg text-sm">
            Reset
          </button>
        </div>
      </div>

      {/* Grid Container - Added touch-action none to prevent scrolling while drawing */}
      <div 
        className="inline-block bg-[#020617] p-1 rounded-xl border border-white/5 shadow-2xl overflow-hidden touch-none" 
        onMouseLeave={handleMouseUp}
        // Basic touch support to prevent page scrolling when touching grid
        onTouchStart={(e) => { if(e.target.classList.contains('node')) e.preventDefault(); }}
      >
        {grid.map((row, rowIdx) => (
          <div key={rowIdx} className="flex">
            {row.map((node, nodeIdx) => (
              <Node 
                key={nodeIdx} 
                {...node} 
                onMouseDown={() => handleMouseDown(node.row, node.col)} 
                onMouseEnter={() => handleMouseEnter(node.row, node.col)} 
                onMouseUp={handleMouseUp} 
              />
            ))}
          </div>
        ))}
      </div>
      
      <p className="mt-4 text-xs text-zinc-500 md:hidden">Tap/Drag to draw walls</p>
    </div>
  );
};

// --- Helpers updated to use gridConfig ---
const getInitialGrid = (config) => {
  const grid = [];
  for (let row = 0; row < config.ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < config.COLS; col++) {
      currentRow.push(createNode(col, row, config));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, config) => ({
  col, row,
  isStart: row === config.START_ROW && col === config.START_COL,
  isFinish: row === config.FINISH_ROW && col === config.FINISH_COL,
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