
import React from 'react';

interface LoadingOverlayProps {
  message: string;
}

const LoadingSpinner: React.FC = () => (
  <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
);


const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50">
      <LoadingSpinner />
      <p className="mt-4 text-xl font-bold text-white font-dotgothic">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
