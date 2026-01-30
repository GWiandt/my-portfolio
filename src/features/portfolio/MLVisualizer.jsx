import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RefreshCw, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MLVisualizer = () => {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([]);
  const [weights, setWeights] = useState({ x: 0, y: 0, bias: 0 }); // The "Brain"
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const navigate = useNavigate();

  // --- 1. Generate Data ---
  useEffect(() => {
    generateData();
  }, []);

  const generateData = () => {
    const newPoints = [];
    for (let i = 0; i < 50; i++) {
      // Random coordinates between -1 and 1
      const x = Math.random() * 2 - 1;
      const y = Math.random() * 2 - 1;
      // Correct Classification: Is it above or below the line y = 0.5x + 0.1?
      // We start with a "Target" line that the AI has to learn.
      const label = y > 0.5 * x + 0.1 ? 1 : -1; 
      newPoints.push({ x, y, label });
    }
    setPoints(newPoints);
    setWeights({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, bias: Math.random() * 2 - 1 });
    setEpoch(0);
    setIsTraining(false);
  };

  // --- 2. The Learning Algorithm (Perceptron) ---
  const trainStep = () => {
    let newWeights = { ...weights };
    let errorCount = 0;
    const learningRate = 0.05;

    points.forEach(point => {
      // 1. Guess: inputs * weights + bias
      const guess = (point.x * newWeights.x) + (point.y * newWeights.y) + newWeights.bias > 0 ? 1 : -1;
      
      // 2. Calculate Error
      const error = point.label - guess; 
      
      if (error !== 0) {
        errorCount++;
        // 3. Update Weights (Gradient Descent Logic)
        newWeights.x += error * point.x * learningRate;
        newWeights.y += error * point.y * learningRate;
        newWeights.bias += error * learningRate;
      }
    });

    setWeights(newWeights);
    setEpoch(prev => prev + 1);
    
    // Stop if perfect or too long
    if (errorCount === 0 || epoch > 500) {
      setIsTraining(false);
    }
  };

  // Animation Loop
  useEffect(() => {
    if (isTraining) {
      const timer = requestAnimationFrame(trainStep);
      return () => cancelAnimationFrame(timer);
    }
  }, [isTraining, weights]);

  // --- 3. Visualization (Drawing) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Coordinate Mapping (Math (-1 to 1) -> Screen (0 to 400))
    const mapX = (x) => (x + 1) * (width / 2);
    const mapY = (y) => (1 - y) * (height / 2); // Flip Y because canvas 0 is top

    // Draw Points
    points.forEach(p => {
      ctx.beginPath();
      ctx.arc(mapX(p.x), mapY(p.y), 6, 0, Math.PI * 2);
      ctx.fillStyle = p.label === 1 ? '#3b82f6' : '#ef4444'; // Blue vs Red
      ctx.fill();
    });

    // Draw Decision Boundary (The AI's current "Line")
    // Formula: w_x * x + w_y * y + bias = 0  =>  y = -(w_x/w_y)x - (bias/w_y)
    ctx.strokeStyle = '#10b981'; // Green Line
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    // Calculate two points to draw the line
    const x1 = -1;
    const y1 = -(weights.x * x1 + weights.bias) / weights.y;
    const x2 = 1;
    const y2 = -(weights.x * x2 + weights.bias) / weights.y;

    ctx.moveTo(mapX(x1), mapY(y1));
    ctx.lineTo(mapX(x2), mapY(y2));
    ctx.stroke();

  }, [points, weights]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col items-center justify-center p-4">
      
      {/* Header */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Back
        </button>
        <h1 className="text-2xl font-bold flex items-center gap-2">
            <Cpu className="text-blue-500" /> Neural Network Visualizer
        </h1>
        <div className="w-20"></div> {/* Spacer */}
      </div>

      {/* Main Visualizer */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <div className="relative bg-[#121214] border border-white/10 rounded-xl p-4 shadow-2xl">
            <canvas ref={canvasRef} width={500} height={500} className="rounded-lg bg-[#0a0a0a]" />
            
            {/* Controls Overlay */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
                <div className="px-3 py-1 bg-zinc-900/80 backdrop-blur border border-white/10 rounded-md text-xs font-mono text-zinc-400">
                    Epoch: <span className="text-white font-bold">{epoch}</span>
                </div>
                <div className="px-3 py-1 bg-zinc-900/80 backdrop-blur border border-white/10 rounded-md text-xs font-mono text-zinc-400">
                    Weights: <br/>
                    x: {weights.x.toFixed(2)}<br/>
                    y: {weights.y.toFixed(2)}
                </div>
            </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mt-8">
        <button 
            onClick={generateData}
            className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-full font-bold transition-all"
        >
            <RefreshCw size={18} /> New Data
        </button>
        <button 
            onClick={() => setIsTraining(!isTraining)}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all shadow-lg ${
                isTraining ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'
            }`}
        >
            {isTraining ? 'Stop Training' : 'Start Training'} <Play size={18} fill="currentColor" />
        </button>
      </div>

      <div className="mt-8 text-center max-w-lg text-zinc-500 text-sm leading-relaxed">
        This demonstrates a <span className="text-zinc-300">Single-Layer Perceptron</span> learning to linearly classify data.
        It uses <span className="text-zinc-300">Gradient Descent</span> to adjust weights iteratively until the green line separates the blue and red points.
      </div>
    </div>
  );
};

export default MLVisualizer;