
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TitleScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full bg-black flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-6xl font-extrabold text-yellow-400 font-dotgothic" style={{ textShadow: '4px 4px 0 #00008b' }}>
        擬似モン
      </h1>
      <h2 className="text-xl text-white mt-4 font-bold">AI画像擬人化バトル</h2>
      <div className="mt-24 animate-pulse">
        <button
          onClick={() => navigate('/menu')}
          className="text-2xl font-bold text-white font-dotgothic"
        >
          - PRESS START -
        </button>
      </div>
      <p className="absolute bottom-4 text-xs text-gray-400">
        © 2024 Gijimon Project
      </p>
    </div>
  );
};

export default TitleScreen;
