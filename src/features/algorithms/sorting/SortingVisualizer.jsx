import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, RefreshCw, Play, BarChart3, Settings2, Hash, StopCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SortingVisualizer = () => {
  const navigate = useNavigate();
  
  // State
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [algo, setAlgo] = useState('bubble');
  const [speed, setSpeed] = useState(100); // 1 to 200 (100 = 10x)
  const [size, setSize] = useState(40);
  const [comparisons, setComparisons] = useState(0);

  // Refs for Async control
  const speedRef = useRef(speed);
  const sizeRef = useRef(size);
  const abortRef = useRef(false);
  const arrayRef = useRef([]); 
  const stepsRef = useRef(0);

  // --- 1. INITIALIZATION ---
  useEffect(() => {
    const initialSize = window.innerWidth < 640 ? 25 : 60;
    setSize(initialSize);
    generateArray(initialSize);
    return () => { abortRef.current = true; };
  }, []);

  useEffect(() => {
      speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
      sizeRef.current = size;
  }, [size]);

  const generateArray = (newSize) => {
    abortRef.current = true; 
    setIsSorting(false);
    setComparisons(0);
    stepsRef.current = 0;
    
    const newArr = [];
    for (let i = 0; i < newSize; i++) {
      newArr.push(Math.floor(Math.random() * 350) + 20); 
    }
    setArray(newArr);
    arrayRef.current = [...newArr];

    setTimeout(() => {
        for (let i = 0; i < newSize; i++) {
            updateBar(i, null, '#6366f1'); 
        }
    }, 0);
  };

  // --- 2. SMOOTH DYNAMIC SLEEP ENGINE ---
  const sleep = () => {
      const s = speedRef.current; // 1 to 200
      const n = sizeRef.current;  // Array Size
      
      // Calculate a "Complexity Factor"
      // Larger arrays need to run faster to feel the same as small arrays
      const complexityMultiplier = Math.max(1, n / 20); 
      
      // Base delay in milliseconds (High speed = Low delay)
      // At speed 10 (1.0x), delay is ~40ms. At speed 200 (20.0x), delay is ~0.5ms
      let delay = 400 / (s * complexityMultiplier);

      // If delay is tiny (< 2ms), we switch to Frame Skipping (Batching)
      // This eliminates the "cliff" because it kicks in naturally based on math
      if (delay < 2) {
          stepsRef.current++;
          
          // How many steps to skip? 
          // If delay calculated to 0.5ms, we need to do 4 steps per frame (2ms / 0.5ms)
          // We target ~16ms per frame (60fps), but let's be safe with 4ms chunks
          const stepsPerFrame = Math.ceil(2 / Math.max(0.1, delay));
          
          if (stepsRef.current % stepsPerFrame !== 0) {
              return Promise.resolve(); // Instant (0ms)
          }
          // Yield to render
          return new Promise(resolve => setTimeout(resolve, 0));
      }

      // Normal sleep for slower speeds
      return new Promise(resolve => setTimeout(resolve, delay));
  };

  const updateBar = (idx, height, color) => {
      const bar = document.getElementById(`bar-${idx}`);
      if (bar) {
          if (height !== null) bar.style.height = `${height}px`;
          if (color !== null) bar.style.backgroundColor = color;
      }
  };

  const incrementComps = () => setComparisons(prev => prev + 1);

  // --- 3. ALGORITHMS ---
  const startSort = async () => {
      setIsSorting(true);
      abortRef.current = false;
      setComparisons(0);
      stepsRef.current = 0;
      
      for(let i=0; i<arrayRef.current.length; i++) updateBar(i, null, '#6366f1');

      try {
          if (algo === 'bubble') await bubbleSort();
          else if (algo === 'selection') await selectionSort();
          else if (algo === 'insertion') await insertionSort();
          else if (algo === 'quick') await quickSortStart();
          
          if (!abortRef.current) {
              for (let i = 0; i < arrayRef.current.length; i++) {
                  updateBar(i, null, '#10b981');
                  await new Promise(r => setTimeout(r, 10)); 
              }
          }
      } catch (e) {
          console.error("Sort aborted");
      }
      
      setIsSorting(false);
  };

  const stopSort = () => {
      abortRef.current = true;
      setIsSorting(false);
  };

  // --- SORTING LOGIC ---
  const bubbleSort = async () => {
      let arr = arrayRef.current;
      let n = arr.length;
      for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
              if (abortRef.current) return;
              
              updateBar(j, null, '#ef4444'); 
              updateBar(j + 1, null, '#ef4444');
              incrementComps();
              await sleep();

              if (arr[j] > arr[j + 1]) {
                  let temp = arr[j];
                  arr[j] = arr[j + 1];
                  arr[j + 1] = temp;
                  updateBar(j, arr[j], '#facc15'); 
                  updateBar(j + 1, arr[j + 1], '#facc15');
                  await sleep();
              }
              updateBar(j, null, '#6366f1'); 
              updateBar(j + 1, null, '#6366f1');
          }
          updateBar(n - i - 1, null, '#10b981'); 
      }
      updateBar(0, null, '#10b981'); 
  };

  const selectionSort = async () => {
      let arr = arrayRef.current;
      let n = arr.length;
      for (let i = 0; i < n - 1; i++) {
          let minIdx = i;
          updateBar(i, null, '#a855f7'); 
          
          for (let j = i + 1; j < n; j++) {
              if (abortRef.current) return;
              updateBar(j, null, '#ef4444'); 
              incrementComps();
              await sleep();
              
              if (arr[j] < arr[minIdx]) {
                  if (minIdx !== i) updateBar(minIdx, null, '#6366f1'); 
                  minIdx = j;
                  updateBar(minIdx, null, '#facc15'); 
              } else {
                  updateBar(j, null, '#6366f1');
              }
          }
          
          if (abortRef.current) return;
          if (minIdx !== i) {
              let temp = arr[minIdx];
              arr[minIdx] = arr[i];
              arr[i] = temp;
              updateBar(minIdx, arr[minIdx], '#6366f1');
              updateBar(i, arr[i], '#10b981'); 
          } else {
              updateBar(i, null, '#10b981'); 
          }
      }
      updateBar(n - 1, null, '#10b981');
  };

  const insertionSort = async () => {
      let arr = arrayRef.current;
      let n = arr.length;
      updateBar(0, null, '#10b981'); 
      
      for (let i = 1; i < n; i++) {
          let key = arr[i];
          let j = i - 1;
          
          updateBar(i, null, '#ef4444');
          await sleep();
          
          while (j >= 0 && arr[j] > key) {
              if (abortRef.current) return;
              incrementComps();
              
              updateBar(j, null, '#facc15');
              arr[j + 1] = arr[j];
              updateBar(j + 1, arr[j + 1], '#facc15');
              await sleep();
              
              updateBar(j + 1, null, '#10b981');
              j = j - 1;
          }
          arr[j + 1] = key;
          updateBar(j + 1, arr[j + 1], '#10b981');
          for(let k=0; k<=i; k++) updateBar(k, null, '#10b981'); 
      }
  };

  const quickSortStart = async () => {
      await quickSort(arrayRef.current, 0, arrayRef.current.length - 1);
  };
  
  const quickSort = async (arr, low, high) => {
      if (low < high) {
          let pi = await partition(arr, low, high);
          if (abortRef.current) return;
          await quickSort(arr, low, pi - 1);
          await quickSort(arr, pi + 1, high);
      } else if (low === high && !abortRef.current) {
          updateBar(low, null, '#10b981');
      }
  };

  const partition = async (arr, low, high) => {
      let pivot = arr[high];
      updateBar(high, null, '#a855f7'); 
      let i = low - 1;
      
      for (let j = low; j <= high - 1; j++) {
          if (abortRef.current) return;
          updateBar(j, null, '#ef4444'); 
          incrementComps();
          await sleep();
          
          if (arr[j] < pivot) {
              i++;
              let temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;
              updateBar(i, arr[i], '#facc15');
              updateBar(j, arr[j], '#facc15');
              await sleep();
              updateBar(i, null, '#6366f1');
          }
          updateBar(j, null, '#6366f1');
      }
      
      if (abortRef.current) return;
      let temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      updateBar(i + 1, arr[i + 1], '#10b981'); 
      updateBar(high, arr[high], '#6366f1');
      await sleep();
      
      return i + 1;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 flex flex-col items-center p-4 pt-24 font-sans">
      
      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <button onClick={() => navigate('/')} className="self-start md:self-auto flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft size={20} /> Back
        </button>
        
        <div className="flex flex-col items-center">
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">Sorting Visualizer</h1>
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-xs font-mono text-zinc-500 mt-2">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div> Unsorted</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-500 rounded-sm"></div> Compare</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-400 rounded-sm"></div> Swap</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Sorted</span>
            </div>
        </div>

        <div className="flex gap-4 text-xs font-mono text-zinc-400 bg-zinc-900 px-4 py-2 rounded-lg border border-white/5 shadow-lg">
            <div className="flex flex-col items-center"><span className="text-[10px] text-zinc-500">ELEMENTS</span><span className="text-white font-bold text-lg">{size}</span></div>
            <div className="w-px bg-white/10"></div>
            <div className="flex flex-col items-center"><span className="text-[10px] text-zinc-500">COMPS</span><span className="text-yellow-500 font-bold text-lg">{comparisons}</span></div>
        </div>
      </div>

      <div className="relative w-full max-w-5xl h-[400px] bg-[#121214] border border-white/10 rounded-2xl p-4 shadow-2xl flex items-end justify-center gap-[2px] mb-6 overflow-hidden">
          {array.map((value, idx) => (
              <div 
                key={idx}
                id={`bar-${idx}`}
                className="bg-indigo-500 rounded-t-sm transition-colors duration-75"
                style={{
                    height: `${value}px`,
                    width: `${100 / size}%`,
                    minWidth: '2px' 
                }}
              ></div>
          ))}
      </div>

      <div className="w-full max-w-5xl bg-zinc-900/50 p-4 md:p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-6 justify-between items-center shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto flex-1">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                  <BarChart3 size={18} className="text-zinc-500"/>
                  <select 
                    value={algo} 
                    onChange={(e) => setAlgo(e.target.value)}
                    disabled={isSorting}
                    className="bg-black border border-white/10 rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none w-full sm:w-40 cursor-pointer disabled:opacity-50 transition-colors focus:border-indigo-500"
                  >
                      <option value="bubble">Bubble Sort</option>
                      <option value="selection">Selection Sort</option>
                      <option value="insertion">Insertion Sort</option>
                      <option value="quick">Quick Sort</option>
                  </select>
              </div>
              
              <div className="flex flex-col w-full sm:w-auto gap-4 flex-1 max-w-md">
                  <div className="flex items-center gap-3">
                       <Hash size={16} className="text-zinc-500"/>
                       <div className="flex flex-col w-full">
                           <div className="flex justify-between text-[10px] text-zinc-500 font-bold mb-1">
                               <span>ARRAY SIZE</span><span>{size}</span>
                           </div>
                           <input 
                              type="range" min="10" max={window.innerWidth < 640 ? 80 : 200} 
                              value={size} 
                              onChange={(e) => {
                                  setSize(Number(e.target.value));
                                  generateArray(Number(e.target.value));
                              }}
                              disabled={isSorting}
                              className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 disabled:opacity-50"
                           />
                       </div>
                  </div>

                  <div className="flex items-center gap-3">
                       <Settings2 size={16} className="text-zinc-500"/>
                       <div className="flex flex-col w-full">
                           <div className="flex justify-between text-[10px] text-zinc-500 font-bold mb-1">
                               <span>SPEED MULTIPLIER</span><span className="text-blue-400">{(speed / 10).toFixed(1)}x</span>
                           </div>
                           <input 
                              type="range" min="1" max="200" 
                              value={speed} 
                              onChange={(e) => setSpeed(Number(e.target.value))}
                              className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                           />
                       </div>
                  </div>
              </div>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
              {isSorting ? (
                  <button onClick={stopSort} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-red-600/20 text-red-500 hover:bg-red-600/30 border border-red-500/20 transition-all shadow-lg">
                      <StopCircle size={18} /> Stop
                  </button>
              ) : (
                  <button onClick={startSort} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-500/20">
                      <Play size={18} fill="currentColor" /> Start Sort
                  </button>
              )}
              
              <button onClick={() => generateArray(size)} disabled={isSorting} className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-zinc-400 hover:text-white transition-colors disabled:opacity-50">
                  <RefreshCw size={20} />
              </button>
          </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;