// src/features/algorithms/sorting/sortingAlgorithms.js

// --- BUBBLE SORT ---
export function getBubbleSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  
  const auxiliaryArray = array.slice();
  bubbleSort(auxiliaryArray, animations);
  return animations;
}

function bubbleSort(mainArray, animations) {
  const N = mainArray.length;
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < N - i - 1; j++) {
      // Push comparison (change color)
      animations.push([j, j + 1]);
      // Push revert color
      animations.push([j, j + 1]);
      
      if (mainArray[j] > mainArray[j + 1]) {
        // Push swap (indices and values)
        animations.push([j, mainArray[j + 1], j + 1, mainArray[j]]);
        
        // Swap locally
        let temp = mainArray[j];
        mainArray[j] = mainArray[j + 1];
        mainArray[j + 1] = temp;
      } else {
        // Push no-op
        animations.push([-1, -1]);
      }
    }
  }
}

// --- MERGE SORT ---
export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  
  while (i <= middleIdx && j <= endIdx) {
    // 1. Comparison: Change color
    animations.push([i, j]);
    // 2. Revert color
    animations.push([i, j]);
    
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      // 3. Overwrite height
      animations.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      // 3. Overwrite height
      animations.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  
  while (i <= middleIdx) {
    animations.push([i, i]);
    animations.push([i, i]);
    animations.push([k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  
  while (j <= endIdx) {
    animations.push([j, j]);
    animations.push([j, j]);
    animations.push([k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}

// --- QUICK SORT ---
export function getQuickSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  quickSortHelper(auxiliaryArray, 0, auxiliaryArray.length - 1, animations);
  return animations;
}

function quickSortHelper(mainArray, startIdx, endIdx, animations) {
  if (startIdx >= endIdx) return;
  
  const pivotIdx = partition(mainArray, startIdx, endIdx, animations);
  quickSortHelper(mainArray, startIdx, pivotIdx - 1, animations);
  quickSortHelper(mainArray, pivotIdx + 1, endIdx, animations);
}

function partition(mainArray, startIdx, endIdx, animations) {
  const pivotValue = mainArray[endIdx]; // We chose the last element as pivot
  let i = startIdx - 1;
  
  for (let j = startIdx; j < endIdx; j++) {
    // 1. Comparison: Change Color
    animations.push([j, endIdx]);
    // 2. Revert Color
    animations.push([j, endIdx]);
    
    if (mainArray[j] <= pivotValue) {
      i++;
      // 3. Swap: Push indices and new heights
      animations.push([i, mainArray[j], j, mainArray[i]]);
      swap(mainArray, i, j);
    } else {
      // 3. No Swap: Push dummy data to keep animation timing consistent
      animations.push([-1, -1, -1, -1]);
    }
  }
  
  // Final Swap to put pivot in correct place
  // 1. Comparison
  animations.push([i + 1, endIdx]);
  // 2. Revert
  animations.push([i + 1, endIdx]);
  // 3. Swap
  animations.push([i + 1, mainArray[endIdx], endIdx, mainArray[i + 1]]);
  swap(mainArray, i + 1, endIdx);
  
  return i + 1;
}

function swap(array, i, j) {
  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}