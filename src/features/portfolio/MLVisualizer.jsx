import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, RefreshCw, Cpu, Settings2, MousePointer2, StopCircle, Trash2, Shuffle, CheckCircle, AlertTriangle, Calculator } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MLVisualizer = () => {
  const navigate = useNavigate();
  
  // State
  const [data, setData] = useState([]); // { x, y, label }
  const [weights, setWeights] = useState({ w1: Math.random() * 2 - 1, w2: Math.random() * 2 - 1, b: Math.random() * 2 - 1 });
  const [isTraining, setIsTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [learningRate, setLearningRate] = useState(0.05);
  const [activeClass, setActiveClass] = useState(1); // 1 = Blue, -1 = Red
  
  const [status, setStatus] = useState('idle'); // 'idle', 'training', 'success', 'failed'
  const [liveMath, setLiveMath] = useState(null); 

  const abortRef = useRef(false);

  useEffect(() => {
      randomizeData();
      return () => { abortRef.current = true; };
  }, []);

  // --- ACTIONS ---
  const randomizeData = () => {
      abortRef.current = true;
      setIsTraining(false);
      setStatus('idle');
      setLiveMath(null);
      
      const newData = [];
      for (let i = 0; i < 40; i++) {
          const isClass1 = Math.random() > 0.5;
          const label = isClass1 ? 1 : -1;
          const x = isClass1 ? Math.random() * 0.4 + 0.5 : Math.random() * 0.4 + 0.1;
          const y = isClass1 ? Math.random() * 0.4 + 0.5 : Math.random() * 0.4 + 0.1;
          
          newData.push({ 
              x: Math.max(0, Math.min(1, x + (Math.random() * 0.2 - 0.1))), 
              y: Math.max(0, Math.min(1, y + (Math.random() * 0.2 - 0.1))), 
              label 
          });
      }
      setData(newData);
      resetModel();
  };

  const resetModel = () => {
      abortRef.current = true;
      setIsTraining(false);
      setStatus('idle');
      setEpoch(0);
      setLiveMath(null);
      setWeights({ w1: Math.random() * 2 - 1, w2: Math.random() * 2 - 1, b: Math.random() * 2 - 1 });
  };

  const clearData = () => {
      abortRef.current = true;
      setIsTraining(false);
      setStatus('idle');
      setData([]);
      setLiveMath(null);
      resetModel();
  };

  const handleSvgClick = (e) => {
      if (isTraining) return;
      const svg = e.currentTarget;
      const rect = svg.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - ((e.clientY - rect.top) / rect.height);
      
      setData([...data, { x, y, label: activeClass }]);
      setStatus('idle');
  };

  // --- MACHINE LEARNING LOGIC ---
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const trainModel = async () => {
      if (data.length === 0) return;
      setIsTraining(true);
      setStatus('training');
      abortRef.current = false;

      let currentWeights = { ...weights };
      let currentEpoch = epoch;

      while (!abortRef.current && currentEpoch < 500) {
          let errorCount = 0;
          
          for (let i = 0; i < data.length; i++) {
              if (abortRef.current) break;
              
              const pt = data[i];
              const sum = (pt.x * currentWeights.w1) + (pt.y * currentWeights.w2) + currentWeights.b;
              const prediction = sum >= 0 ? 1 : -1;
              const error = pt.label - prediction; 
              
              setLiveMath({
                  rawX: pt.x, rawY: pt.y,
                  x: pt.x.toFixed(2), y: pt.y.toFixed(2),
                  w1: currentWeights.w1.toFixed(2), w2: currentWeights.w2.toFixed(2), b: currentWeights.b.toFixed(2),
                  sum: sum.toFixed(2),
                  target: pt.label, prediction, error
              });

              if (error !== 0) {
                  errorCount++;
                  currentWeights.w1 += learningRate * error * pt.x;
                  currentWeights.w2 += learningRate * error * pt.y;
                  currentWeights.b += learningRate * error * 1;
                  
                  setWeights({ ...currentWeights });
                  await sleep(60); 
              } else {
                  await sleep(10);
              }
          }

          if (abortRef.current) break;

          currentEpoch++;
          setEpoch(currentEpoch);
          setWeights({ ...currentWeights });

          if (errorCount === 0) {
              setStatus('success');
              break;
          }
      }

      if (!abortRef.current && status !== 'success') {
          setStatus(currentEpoch >= 500 ? 'failed' : 'idle');
      }
      
      setIsTraining(false);
      // NOTE: We do NOT clear liveMath here anymore, so the result persists on Stop!
  };

  const getLineCoordinates = () => {
      const { w1, w2, b } = weights;
      if (w2 === 0) return { x1: 0, y1: 0, x2: 0, y2: 0 }; 

      const yAtX0 = -(b / w2);
      const yAtX1 = -(w1 * 1 + b) / w2;

      return {
          x1: '0%', y1: `${(1 - yAtX0) * 100}%`,
          x2: '100%', y2: `${(1 - yAtX1) * 100}%`
      };
  };

  const lineCoords = getLineCoordinates();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col items-center p-4 pt-24 font-sans pb-20">
      
      {/* Header */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <button onClick={() => navigate('/')} className="self-start md:self-auto flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Back
        </button>
        
        <div className="flex flex-col items-center">
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Cpu className="text-red-500" /> Neural Network Visualizer
            </h1>
            <p className="text-xs text-zinc-500 mt-1 font-mono">Single-Layer Perceptron</p>
        </div>

        <div className="flex gap-4 text-xs font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5 shadow-lg">
            <div className="flex flex-col items-center"><span className="text-[10px] text-zinc-500">STATUS</span>
                <span className={`font-bold text-lg uppercase ${status === 'success' ? 'text-green-500' : status === 'failed' ? 'text-red-500' : 'text-zinc-300'}`}>
                    {status}
                </span>
            </div>
            <div className="w-px bg-white/10"></div>
            <div className="flex flex-col items-center"><span className="text-[10px] text-zinc-500">EPOCH</span><span className="text-white font-bold text-lg">{epoch}</span></div>
        </div>
      </div>

      {/* Main Interactive Area */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          
          {/* Architecture & Math View */}
          <div className="lg:col-span-2 bg-[#121214] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col min-h-[400px] relative overflow-hidden">
              <h3 className="absolute top-4 left-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">Network Graph</h3>
              
              {/* SVG Network Drawing */}
              <div className="flex items-center justify-between w-full max-w-[250px] mt-6 mx-auto mb-4">
                  <div className="flex flex-col gap-10 relative z-10">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center font-mono text-xs text-zinc-300 shadow-lg relative">
                          X₁
                          {liveMath && <span className="absolute -left-12 text-[10px] font-mono text-zinc-500">{liveMath.x}</span>}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center font-mono text-xs text-zinc-300 shadow-lg relative">
                          X₂
                          {liveMath && <span className="absolute -left-12 text-[10px] font-mono text-zinc-500">{liveMath.y}</span>}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center font-mono text-xs text-zinc-500 shadow-lg border-dashed">Bias</div>
                  </div>
                  
                  <svg className="absolute inset-0 w-full h-[220px] top-12 pointer-events-none z-0">
                      <path d="M 120 40 C 160 40, 160 100, 220 100" fill="transparent" stroke={weights.w1 > 0 ? '#3b82f6' : '#ef4444'} strokeWidth={Math.max(1, Math.min(6, Math.abs(weights.w1) * 3))} opacity="0.6" />
                      <path d="M 120 120 C 160 120, 160 100, 220 100" fill="transparent" stroke={weights.w2 > 0 ? '#3b82f6' : '#ef4444'} strokeWidth={Math.max(1, Math.min(6, Math.abs(weights.w2) * 3))} opacity="0.6" />
                      <path d="M 120 200 C 160 200, 160 100, 220 100" fill="transparent" stroke={weights.b > 0 ? '#3b82f6' : '#ef4444'} strokeWidth={Math.max(1, Math.min(6, Math.abs(weights.b) * 3))} opacity="0.3" strokeDasharray="4" />
                  </svg>

                  <div className="relative z-10">
                      <div className="w-14 h-14 rounded-full bg-zinc-800 border-2 border-red-500/50 flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(239,68,68,0.2)]">Σ</div>
                  </div>
              </div>

              {/* NEW VISUAL MATH DASHBOARD */}
              <div className="mt-auto w-full bg-[#0a0a0a] rounded-xl border border-white/5 overflow-hidden">
                  <div className="bg-white/5 px-4 py-2 flex items-center gap-2 border-b border-white/5">
                      <Calculator size={14} className="text-zinc-400"/>
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Live Calculation</span>
                  </div>
                  
                  <div className="p-4 space-y-3">
                      {liveMath ? (
                          <>
                            {/* The Equation */}
                            <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-1">
                                <span>(x₁ · w₁)</span>
                                <span>+</span>
                                <span>(x₂ · w₂)</span>
                                <span>+</span>
                                <span>Bias</span>
                            </div>
                            <div className="flex justify-between text-xs font-mono font-bold text-zinc-300">
                                <span>({liveMath.x} · {liveMath.w1})</span>
                                <span>+</span>
                                <span>({liveMath.y} · {liveMath.w2})</span>
                                <span>+</span>
                                <span>{liveMath.b}</span>
                            </div>

                            <div className="w-full h-px bg-white/10 my-2"></div>

                            {/* The Result */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-[10px] text-zinc-500 uppercase">Weighted Sum</div>
                                    <div className="text-xl font-bold text-white">{liveMath.sum}</div>
                                </div>
                                
                                {/* Result Badge */}
                                <div className={`px-4 py-2 rounded-lg border ${liveMath.prediction === 1 ? 'bg-blue-500/10 border-blue-500/30' : 'bg-red-500/10 border-red-500/30'} flex flex-col items-end`}>
                                    <div className="text-[10px] font-bold opacity-70 uppercase mb-1">Prediction</div>
                                    <div className={`text-lg font-bold leading-none ${liveMath.prediction === 1 ? 'text-blue-400' : 'text-red-400'}`}>
                                        {liveMath.prediction === 1 ? "Class 1" : "Class 2"}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Error Warning */}
                            {liveMath.error !== 0 ? (
                                <div className="mt-2 text-xs text-yellow-500 flex items-center gap-2 bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20">
                                    <AlertTriangle size={12} />
                                    <span>Incorrect. Adjusting Weights...</span>
                                </div>
                            ) : (
                                <div className="mt-2 text-xs text-green-500 flex items-center gap-2 bg-green-500/10 p-2 rounded-lg border border-green-500/20">
                                    <CheckCircle size={12} />
                                    <span>Correct Classification</span>
                                </div>
                            )}
                          </>
                      ) : (
                          <div className="h-[100px] flex items-center justify-center text-zinc-600 text-xs italic">
                              Start training to see live math...
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* Scatter Plot / Decision Boundary */}
          <div className="lg:col-span-3 bg-[#121214] border border-white/10 rounded-2xl p-2 shadow-2xl relative h-[400px] lg:h-auto overflow-hidden">
              
              {/* SUCCESS OVERLAY */}
              {status === 'success' && (
                  <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                      <div className="bg-green-500 text-black px-6 py-3 rounded-full font-bold shadow-2xl shadow-green-500/20 flex items-center gap-2 animate-bounce">
                          <CheckCircle size={20} /> Converged!
                      </div>
                  </div>
              )}

              {/* FAILED OVERLAY */}
              {status === 'failed' && (
                  <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                      <div className="bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl shadow-red-500/20 flex items-center gap-2">
                          <AlertTriangle size={20} /> Failed to Converge
                      </div>
                  </div>
              )}

              {/* Interaction Controls */}
              {!isTraining && (
                  <div className="absolute top-4 right-4 z-20 flex bg-black/80 backdrop-blur-md rounded-lg border border-white/10 p-1">
                      <button onClick={() => setActiveClass(1)} className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeClass === 1 ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Class 1 (Blue)</button>
                      <button onClick={() => setActiveClass(-1)} className={`px-4 py-2 rounded-md text-xs font-bold transition-all ${activeClass === -1 ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}>Class 2 (Red)</button>
                  </div>
              )}

              {/* SVG Canvas for points and line */}
              <svg className="w-full h-full bg-[#18181b] rounded-xl cursor-crosshair touch-none" onClick={handleSvgClick}>
                  {/* Grid Lines */}
                  <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                      </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* Decision Boundary Line */}
                  <line 
                      x1={lineCoords.x1} y1={lineCoords.y1} 
                      x2={lineCoords.x2} y2={lineCoords.y2} 
                      stroke={status === 'success' ? '#10b981' : '#a855f7'} 
                      strokeWidth="3" 
                      strokeDasharray={status === 'success' ? 'none' : '8 4'}
                      className="transition-all duration-75"
                  />

                  {/* Highlight current point being evaluated */}
                  {liveMath && (
                      <circle 
                          cx={`${liveMath.rawX * 100}%`} 
                          cy={`${(1 - liveMath.rawY) * 100}%`} 
                          r="15" fill="none" stroke="#facc15" strokeWidth="3"
                          className="animate-pulse"
                      />
                  )}

                  {/* Data Points */}
                  {data.map((pt, i) => (
                      <circle 
                          key={i} 
                          cx={`${pt.x * 100}%`} 
                          cy={`${(1 - pt.y) * 100}%`} 
                          r="6" 
                          fill={pt.label === 1 ? '#3b82f6' : '#ef4444'} 
                          stroke="#18181b" strokeWidth="2"
                          className="transition-transform hover:scale-150"
                      />
                  ))}
              </svg>
          </div>
      </div>

      {/* Control Panel */}
      <div className="w-full max-w-5xl bg-zinc-900/50 p-4 md:p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center shadow-xl">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto flex-1">
              <div className="flex items-center gap-3 w-full sm:w-64">
                   <Settings2 size={16} className="text-zinc-500"/>
                   <div className="flex flex-col w-full">
                       <div className="flex justify-between text-[10px] text-zinc-500 font-bold mb-1">
                           <span>LEARNING RATE</span><span className="text-blue-400">{learningRate}</span>
                       </div>
                       <input 
                          type="range" min="0.01" max="0.5" step="0.01"
                          value={learningRate} 
                          onChange={(e) => setLearningRate(Number(e.target.value))}
                          disabled={isTraining}
                          className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
                       />
                   </div>
              </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto flex-wrap justify-center">
              {isTraining ? (
                  <button onClick={() => { abortRef.current = true; setIsTraining(false); }} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-red-600/20 text-red-500 hover:bg-red-600/30 border border-red-500/20 transition-all shadow-lg">
                      <StopCircle size={18} /> Stop
                  </button>
              ) : (
                  <button onClick={trainModel} disabled={data.length === 0 || status === 'success'} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50">
                      <Play size={18} fill="currentColor" /> Train Network
                  </button>
              )}
              
              <button onClick={randomizeData} disabled={isTraining} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors disabled:opacity-50" title="Shuffle Data Points">
                  <Shuffle size={20} />
              </button>

              <button onClick={resetModel} disabled={isTraining} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors disabled:opacity-50" title="Reset Weights">
                  <RefreshCw size={20} />
              </button>
              
              <button onClick={clearData} disabled={isTraining} className="p-3 bg-zinc-800 hover:bg-red-900/30 text-zinc-400 hover:text-red-400 rounded-xl transition-colors disabled:opacity-50" title="Clear All Data">
                  <Trash2 size={20} />
              </button>
          </div>
      </div>
    </div>
  );
};

export default MLVisualizer;