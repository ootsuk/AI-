
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainMenuButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xl py-4 px-6 rounded-lg border-b-4 border-blue-800 active:border-b-0 transition-all duration-150 ease-in-out shadow-lg"
  >
    {children}
  </button>
);

const MainMenu: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-extrabold text-white mb-12 font-dotgothic">メインメニュー</h1>
      <div className="w-full max-w-sm space-y-6">
        <MainMenuButton onClick={() => navigate('/create')}>擬似モン生成</MainMenuButton>
        <MainMenuButton onClick={() => navigate('/battle/prepare')}>バトル</MainMenuButton>
        <MainMenuButton onClick={() => navigate('/pokedex')}>図鑑</MainMenuButton>
      </div>
    </div>
  );
};

export default MainMenu;
