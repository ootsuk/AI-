
import React from 'react';
import { GijimonType } from '../types';
import { TYPE_COLORS } from '../constants/typeChart';

interface TypeBadgeProps {
  type: GijimonType;
  className?: string;
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type, className = '' }) => {
  const colorClass = TYPE_COLORS[type] || 'bg-gray-400 text-black';
  return (
    <span className={`px-3 py-1 text-sm font-bold rounded-full shadow-md ${colorClass} ${className}`}>
      {type}
    </span>
  );
};

export default TypeBadge;
