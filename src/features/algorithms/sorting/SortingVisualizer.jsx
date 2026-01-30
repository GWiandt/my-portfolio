import React, { useState, useEffect } from "react";
import { getBubbleSortAnimations, getMergeSortAnimations, getQuickSortAnimations } from "./sortingAlgorithms";
import "./SortingVisualizer.css";

const ANIMATION_SPEED_MS = 3;
const NUMBER_OF_ARRAY_BARS = 150;
const PRIMARY_COLOR = "#3b82f6"; // Blue
const SECONDARY_COLOR = "#ef4444"; // Red (Comparing)
const PIVOT_COLOR = "#10b981"; // Green (Sorted/Pivot)

const SortingVisualizer = () => {
  const [array, setArray] = useState([]);

  useEffect(() => {
    resetArray();
  }, []);

  const resetArray = () => {
    const newArray = [];
    for (let i = 0; i < NUMBER_OF_ARRAY_BARS; i++) {
      newArray.push(randomIntFromInterval(10, 600));
    }
    setArray(newArray);
  };

  // --- Bubble Sort ---
  const bubbleSort = () => {
    const animations = getBubbleSortAnimations(array);
    animateBasicSwap(animations);
  };

  // --- Merge Sort ---
  const mergeSort = () => {
    const animations = getMergeSortAnimations(array);
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      const isColorChange = i % 3 !== 2;
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeight] = animations[i];
          const barOneStyle = arrayBars[barOneIdx].style;
          barOneStyle.height = `${newHeight}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
  };

  // --- Quick Sort ---
  const quickSort = () => {
    const animations = getQuickSortAnimations(array);
    animateBasicSwap(animations);
  };

  // Helper for Bubble and Quick Sort (since they both Swap)
  const animateBasicSwap = (animations) => {
    for (let i = 0; i < animations.length; i++) {
      const arrayBars = document.getElementsByClassName("array-bar");
      const isColorChange = i % 3 !== 2;
      
      if (isColorChange) {
        const [barOneIdx, barTwoIdx] = animations[i];
        const barOneStyle = arrayBars[barOneIdx].style;
        const barTwoStyle = arrayBars[barTwoIdx].style;
        const color = i % 3 === 0 ? SECONDARY_COLOR : PRIMARY_COLOR;
        setTimeout(() => {
          barOneStyle.backgroundColor = color;
          barTwoStyle.backgroundColor = color;
        }, i * ANIMATION_SPEED_MS);
      } else {
        setTimeout(() => {
          const [barOneIdx, newHeightOne, barTwoIdx, newHeightTwo] = animations[i];
          if (barOneIdx === -1) return; // No swap occurred
          const barOneStyle = arrayBars[barOneIdx].style;
          const barTwoStyle = arrayBars[barTwoIdx].style;
          barOneStyle.height = `${newHeightOne}px`;
          barTwoStyle.height = `${newHeightTwo}px`;
        }, i * ANIMATION_SPEED_MS);
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-[#0a0a0a] pt-10">
      <div className="mb-8 text-center w-full max-w-4xl">
        <h1 className="text-4xl font-black text-white tracking-tight mb-6 uppercase italic">
          Sorting <span className="text-blue-500">Visualizer</span>
        </h1>
        
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={resetArray} className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-all">Generate New Array</button>
          <button onClick={bubbleSort} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all">Bubble Sort</button>
          <button onClick={mergeSort} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all">Merge Sort</button>
          <button onClick={quickSort} className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all">Quick Sort</button>
        </div>
      </div>

      <div className="flex items-end justify-center w-full max-w-6xl h-[600px] px-4 border-b border-white/10">
        {array.map((value, idx) => (
          <div
            className="array-bar"
            key={idx}
            style={{
              height: `${value}px`,
              backgroundColor: PRIMARY_COLOR,
              width: `${800 / NUMBER_OF_ARRAY_BARS}px`,
              margin: "0 1px",
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default SortingVisualizer;