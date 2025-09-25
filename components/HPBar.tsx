import React from 'react';

interface HPBarProps {
  currentHp: number;
  maxHp: number;
}

const HPBar: React.FC<HPBarProps> = ({ currentHp, maxHp }) => {
  const percentage = maxHp > 0 ? (currentHp / maxHp) * 100 : 0;
  let barColor = 'bg-green-500';
  if (percentage < 50) barColor = 'bg-yellow-500';
  if (percentage < 20) barColor = 'bg-red-500';

  return (
    <div className="w-full bg-gray-700 rounded-full h-4 border-2 border-gray-900 overflow-hidden">
      <div
        className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default HPBar;