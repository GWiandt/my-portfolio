// src/features/algorithms/pathfinding/Node/Node.jsx
import React from "react";
import "./Node.css";

const Node = React.memo(({ row, col, isStart, isFinish, isWall, onMouseDown, onMouseEnter, onMouseUp }) => {
  const extraClassName = isFinish 
    ? "node-finish" 
    : isStart 
    ? "node-start" 
    : isWall 
    ? "node-wall" 
    : "";

  return (
    <div
      id={`node-${row}-${col}`}
      className={`node ${extraClassName}`}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
    />
  );
});

export default Node;