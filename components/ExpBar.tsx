import React from 'react';

interface ExpBarProps {
  currentExp: number;
  expToNextLevel: number;
}

const ExpBar: React.FC<ExpBarProps> = ({ currentExp, expToNextLevel }) => {
  const percentage = expToNextLevel > 0 ? (currentExp / expToNextLevel) * 100 : 0;

  return (
    <div className="w-full bg-gray-700 rounded-full h-1.5 border border-gray-900 overflow-hidden">
      <div
        className="h-full bg-cyan-400"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ExpBar;