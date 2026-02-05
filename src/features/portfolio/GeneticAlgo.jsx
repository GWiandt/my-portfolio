import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, Dna, Trophy, Eraser, MousePointer2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const POPULATION_SIZE = 400;
const LIFESPAN = 800; 
const MAX_FORCE = 0.5;
const GRID_RES = 20; // Resolution of the scent map (20x20px blocks)

const GeneticAlgo = () => {
  const canvasRef = useRef(null);
  const requestRef = useRef();
  const navigate = useNavigate();

  const [generation, setGeneration] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [bestFitness, setBestFitness] = useState(0);
  const [globalBest, setGlobalBest] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showHeatmap, setShowHeatmap] = useState(false);

  const population = useRef([]);
  const matingPool = useRef([]);
  const target = useRef({ x: 400, y: 50 });
  const count = useRef(0);
  
  const obstacles = useRef([{ x: 200, y: 300, w: 400, h: 20 }]);
  const fitnessGrid = useRef([]); 
  const cols = Math.ceil(800 / GRID_RES);
  const rows = Math.ceil(600 / GRID_RES);

  // --- 1. INTELLIGENT MAPPING (BFS) ---
  const updateFitnessGrid = () => {
    const grid = new Array(cols).fill(0).map(() => new Array(rows).fill(Infinity));
    const queue = [];
    const targetCol = Math.floor(target.current.x / GRID_RES);
    const targetRow = Math.floor(target.current.y / GRID_RES);
    
    if (targetCol >= 0 && targetCol < cols && targetRow >= 0 && targetRow < rows) {
        grid[targetCol][targetRow] = 0;
        queue.push({ c: targetCol, r: targetRow, dist: 0 });
    }

    while (queue.length > 0) {
        const { c, r, dist } = queue.shift();
        const neighbors = [{ c: c + 1, r: r }, { c: c - 1, r: r }, { c: c, r: r + 1 }, { c: c, r: r - 1 }];

        for (let n of neighbors) {
            if (n.c >= 0 && n.c < cols && n.r >= 0 && n.r < rows) {
                if (grid[n.c][n.r] === Infinity) {
                    const centerX = n.c * GRID_RES + GRID_RES / 2;
                    const centerY = n.r * GRID_RES + GRID_RES / 2;
                    let isBlocked = false;
                    for (let obs of obstacles.current) {
                        if (centerX > obs.x && centerX < obs.x + obs.w && centerY > obs.y && centerY < obs.y + obs.h) {
                            isBlocked = true;
                            break;
                        }
                    }
                    if (!isBlocked) {
                        grid[n.c][n.r] = dist + 1;
                        queue.push({ c: n.c, r: n.r, dist: dist + 1 });
                    }
                }
            }
        }
    }
    fitnessGrid.current = grid;
  };

  const initPopulation = () => {
    population.current = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
      population.current.push(createRocket());
    }
    count.current = 0;
    setGeneration(1);
    setBestFitness(0);
    setSuccessCount(0);
    draw();
  };

  const createRocket = (dna) => {
    return {
      pos: { x: 400, y: 580 },
      vel: { x: 0, y: 0 },
      acc: { x: 0, y: 0 },
      dna: dna || generateRandomDNA(),
      fitness: 0,
      completed: false,
      crashed: false,
      bestMapScore: Infinity, 
    };
  };

  const generateRandomDNA = () => {
    const genes = [];
    let angle = -Math.PI / 2; 
    for (let i = 0; i < LIFESPAN; i++) {
      const angleChange = (Math.random() - 0.5) * 1.5; 
      angle += angleChange;
      const mag = Math.random() * MAX_FORCE;
      genes.push({ x: Math.cos(angle) * mag, y: Math.sin(angle) * mag });
    }
    return genes;
  };

  const runPhysicsStep = () => {
    if (count.current >= LIFESPAN) {
      evaluate();
      selection();
      count.current = 0;
      setGeneration(g => g + 1);
      return; 
    }
    let reached = 0;
    population.current.forEach(rocket => {
      if (!rocket.completed && !rocket.crashed) {
        applyForce(rocket, rocket.dna[count.current]);
        rocket.vel.x += rocket.acc.x;
        rocket.vel.y += rocket.acc.y;
        rocket.pos.x += rocket.vel.x;
        rocket.pos.y += rocket.vel.y;
        rocket.acc = { x: 0, y: 0 };
        checkCollision(rocket);
        if (!rocket.crashed) {
            const col = Math.floor(rocket.pos.x / GRID_RES);
            const row = Math.floor(rocket.pos.y / GRID_RES);
            if (col >= 0 && col < cols && row >= 0 && row < rows) {
                const mapVal = fitnessGrid.current[col][row];
                if (mapVal < rocket.bestMapScore) rocket.bestMapScore = mapVal;
            }
        }
      }
      if (rocket.completed) reached++;
    });
    setSuccessCount(reached);
    count.current++;
  };

  const update = () => {
    for(let i = 0; i < speed; i++) { runPhysicsStep(); }
    draw();
    if (isRunning) requestRef.current = requestAnimationFrame(update);
  };

  const applyForce = (rocket, force) => {
    rocket.acc.x += force.x;
    rocket.acc.y += force.y;
  };

  const checkCollision = (rocket) => {
    const d = Math.hypot(rocket.pos.x - target.current.x, rocket.pos.y - target.current.y);
    if (d < 15) {
      rocket.completed = true;
      rocket.pos = { ...target.current };
    }
    for (let obs of obstacles.current) {
        if (rocket.pos.x > obs.x && rocket.pos.x < obs.x + obs.w && rocket.pos.y > obs.y && rocket.pos.y < obs.y + obs.h) {
            rocket.crashed = true; return;
        }
    }
    if (rocket.pos.x < 0 || rocket.pos.x > 800 || rocket.pos.y > 600 || rocket.pos.y < 0) {
      rocket.crashed = true;
    }
  };

  const evaluate = () => {
    let maxFit = 0;
    population.current.forEach(rocket => {
      let mapScore = rocket.bestMapScore;
      if (mapScore === Infinity) mapScore = 1000;
      let fit = 1 / (mapScore * mapScore + 1);
      if (rocket.completed) { fit *= 10; fit += (LIFESPAN - count.current) * 0.1; }
      if (rocket.crashed) fit *= 0.5;
      rocket.fitness = fit;
      if (fit > maxFit) maxFit = fit;
    });
    population.current.sort((a, b) => b.fitness - a.fitness);
    const bestFit = population.current[0].fitness;
    population.current.forEach(rocket => rocket.fitness /= bestFit);
    const displayScore = population.current[0].bestMapScore === Infinity ? 0 : (100 - population.current[0].bestMapScore);
    setBestFitness(displayScore);
    setGlobalBest(prev => displayScore > prev ? displayScore : prev);
  };

  const selection = () => {
    matingPool.current = [];
    population.current.forEach(rocket => {
      const n = Math.floor(rocket.fitness * 100);
      for (let i = 0; i < n; i++) { matingPool.current.push(rocket.dna); }
    });
    if (matingPool.current.length === 0) matingPool.current = population.current.map(r => r.dna);
    const newPop = [];
    for(let i=0; i<3; i++) newPop.push(createRocket(JSON.parse(JSON.stringify(population.current[i].dna))));
    for (let i = 3; i < POPULATION_SIZE; i++) {
      const parentA = random(matingPool.current);
      const parentB = random(matingPool.current);
      const childDNA = crossover(parentA, parentB);
      mutate(childDNA);
      newPop.push(createRocket(childDNA));
    }
    population.current = newPop;
  };

  const crossover = (dnaA, dnaB) => {
    const mid = Math.floor(Math.random() * dnaA.length);
    const newDNA = [];
    for (let i = 0; i < dnaA.length; i++) { newDNA[i] = i < mid ? dnaA[i] : dnaB[i]; }
    return newDNA;
  };

  const mutate = (dna) => {
    const mutationRate = 0.02; 
    for (let i = 0; i < dna.length; i++) {
      if (Math.random() < mutationRate) {
        const angle = Math.random() * Math.PI * 2;
        const mag = Math.random() * MAX_FORCE;
        dna[i] = { x: Math.cos(angle) * mag, y: Math.sin(angle) * mag };
      }
    }
  };

  const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // --- NEW: RESPONSIVE MOUSE COORDINATES ---
  const getScaledPos = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY
      };
  };

  const handleMouseDown = (e) => {
    const { x, y } = getScaledPos(e); 
    setDrawStart({ x, y });
    setIsDrawing(true);
    setHasInteracted(true);
  };

  const handleMouseUp = (e) => {
    if (!isDrawing || !drawStart) return;
    const { x, y } = getScaledPos(e); 
    
    const w = x - drawStart.x;
    const h = y - drawStart.y;
    
    const newObs = {
        x: w < 0 ? x : drawStart.x,
        y: h < 0 ? y : drawStart.y,
        w: Math.abs(w),
        h: Math.abs(h)
    };

    if (newObs.w > 5 && newObs.h > 5) {
        obstacles.current.push(newObs);
        updateFitnessGrid();
    }
    setIsDrawing(false);
    setDrawStart(null);
    draw(); 
  };

  const handleMouseMove = (e) => {
    if (!isDrawing || !drawStart) return;
    draw(); 
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { x, y } = getScaledPos(e); 
    
    ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
    ctx.fillRect(drawStart.x, drawStart.y, x - drawStart.x, y - drawStart.y);
  };

  const clearObstacles = () => {
    obstacles.current = [];
    updateFitnessGrid();
    initPopulation(); 
    setHasInteracted(true); 
  };
  
  const generateRandomTrack = () => {
      obstacles.current = [];
      const numWalls = 4;
      const wallHeight = 15;
      const gapSize = 160; 
      const startY = 500;
      const endY = 100;
      const spacing = (startY - endY) / numWalls;
      for(let i = 0; i < numWalls; i++) {
          const y = startY - ((i + 1) * spacing);
          const gapX = Math.random() * (800 - gapSize - 100) + 50;
          obstacles.current.push({ x: 0, y: y, w: gapX, h: wallHeight });
          obstacles.current.push({ x: gapX + gapSize, y: y, w: 800 - (gapX + gapSize), h: wallHeight });
      }
      updateFitnessGrid(); 
      initPopulation();
      setHasInteracted(true); 
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (showHeatmap && fitnessGrid.current.length > 0) {
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                const val = fitnessGrid.current[c][r];
                if (val !== Infinity && val > 0) {
                    const intensity = Math.max(0, 1 - val / 50); 
                    ctx.fillStyle = `rgba(16, 185, 129, ${intensity * 0.3})`;
                    ctx.fillRect(c * GRID_RES, r * GRID_RES, GRID_RES, GRID_RES);
                }
            }
        }
    }
    ctx.fillStyle = '#ef4444';
    obstacles.current.forEach(obs => ctx.fillRect(obs.x, obs.y, obs.w, obs.h));
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(target.current.x, target.current.y, 16, 0, Math.PI * 2);
    ctx.fill();
    population.current.forEach(rocket => {
      ctx.save();
      ctx.translate(rocket.pos.x, rocket.pos.y);
      const theta = Math.atan2(rocket.vel.y, rocket.vel.x) + Math.PI / 2;
      ctx.rotate(theta);
      if (rocket.completed) ctx.fillStyle = '#10b981';
      else if (rocket.crashed) ctx.fillStyle = 'rgba(239, 68, 68, 0.2)'; 
      else ctx.fillStyle = 'rgba(59, 130, 246, 0.8)'; 
      ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(-3, 6); ctx.lineTo(3, 6); ctx.closePath(); ctx.fill();
      ctx.restore();
    });
  };

  useEffect(() => {
    updateFitnessGrid(); 
    initPopulation(); 
    if (isRunning) requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  useEffect(() => {
    if (isRunning) requestRef.current = requestAnimationFrame(update);
    else cancelAnimationFrame(requestRef.current);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, speed, showHeatmap]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col items-center justify-center p-4 pt-24">
      <div className="w-full max-w-[800px] flex justify-between items-center mb-4">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Back
        </button>
        <div className="hidden sm:block">
            <h1 className="text-xl font-bold flex items-center gap-2">
                <Dna className="text-purple-500" /> Evolutionary AI
            </h1>
        </div>
        <div className="flex gap-2 sm:gap-4 text-xs font-mono text-zinc-400 bg-zinc-900 px-3 py-2 rounded-lg border border-white/5">
            <div>GEN: <span className="text-white font-bold">{generation}</span></div>
            <div className="hidden sm:block">ALIVE: <span className="text-blue-400 font-bold">{successCount}</span></div>
            <div className="pl-3 border-l border-white/10" title="Progress Metric">
                SCORE: <span className="text-yellow-500 font-bold">{bestFitness}</span>
            </div>
        </div>
      </div>

      <div className="relative group select-none w-full max-w-[800px]">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-[#121214] border border-white/10 rounded-xl overflow-hidden shadow-2xl cursor-crosshair">
            <canvas 
                ref={canvasRef} 
                width={800} 
                height={600} 
                className="block bg-[#18181b] w-full h-auto"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onTouchStart={(e) => handleMouseDown(e.touches[0])}
                onTouchEnd={(e) => handleMouseUp(e.changedTouches[0])}
                onTouchMove={(e) => handleMouseMove(e.touches[0])}
            />
            
            {!isRunning && !hasInteracted && generation === 1 && count.current === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10 pointer-events-none text-center p-4">
                    <span className="text-white font-bold text-lg sm:text-xl flex flex-col sm:flex-row items-center gap-2">
                        <MousePointer2 /> Draw walls or click Start
                    </span>
                </div>
            )}
        </div>
      </div>

      <div className="w-full max-w-[800px] mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-500 uppercase">Simulation Control</span>
                <span className="text-xs font-mono text-blue-400">{speed}x Speed</span>
            </div>
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => { setIsRunning(!isRunning); setHasInteracted(true); }}
                    className={`flex-1 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${isRunning ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-green-600 hover:bg-green-500'}`}
                >
                    {isRunning ? 'Pause' : 'Start Evolution'}
                </button>
                <button onClick={() => { initPopulation(); updateFitnessGrid(); }} className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg">
                    <RefreshCw size={20} />
                </button>
            </div>
            <input type="range" min="1" max="50" step="1" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"/>
        </div>

        <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5 flex flex-col gap-3">
            <span className="text-xs font-bold text-zinc-500 uppercase">Track Builder</span>
            <div className="flex gap-2">
                <button onClick={clearObstacles} className="flex-1 py-2 bg-zinc-800 hover:bg-red-900/50 text-zinc-300 hover:text-red-200 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
                    <Eraser size={16} /> Clear
                </button>
                <button onClick={generateRandomTrack} className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors">
                    Random
                </button>
                <button onClick={() => setShowHeatmap(!showHeatmap)} className={`px-3 rounded-lg border border-white/10 transition-colors ${showHeatmap ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'}`} title="Visualize AI Scent Map">
                    <Eye size={18} />
                </button>
            </div>
            <p className="text-[10px] text-zinc-500 text-center mt-1">Tip: Toggle the <Eye size={10} className="inline" /> icon to see the logic map.</p>
        </div>
      </div>
    </div>
  );
};

export default GeneticAlgo;