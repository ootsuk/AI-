
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';
import type { Gijimon, Move } from '../types';
import TypeBadge from '../components/TypeBadge';
import StatDisplay from '../components/StatDisplay';

const GijimonDetailView: React.FC<{ gijimon: Gijimon; onClose: () => void }> = ({ gijimon, onClose }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 z-10 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl border-4 border-gray-600 p-4 relative max-h-full overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-4 text-white text-3xl font-bold z-20">&times;</button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
          {/* Left Column */}
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold mb-2 font-dotgothic">{gijimon.name}</h2>
            <div className="w-full aspect-square bg-gray-900 rounded-lg p-2 mb-2">
              <img src={gijimon.gijimonImage} alt={gijimon.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-bold">Lv. {gijimon.level}</span>
              <TypeBadge type={gijimon.type} />
            </div>
            <p className="text-sm text-gray-300 mt-2 text-center">{gijimon.description}</p>
          </div>
          {/* Right Column */}
          <div>
            <h3 className="text-xl font-bold mb-2">ステータス</h3>
            <StatDisplay stats={gijimon.stats} />
            <h3 className="text-xl font-bold mt-4 mb-2">覚えている技</h3>
            <div className="space-y-2">
              {gijimon.moves.map((move: Move) => (
                <div key={move.name} className="bg-gray-700 p-2 rounded-md flex justify-between items-center">
                  <span className="font-bold">{move.name}</span>
                  <TypeBadge type={move.type} />
                </div>
              ))}
            </div>
             <h3 className="text-xl font-bold mt-4 mb-2">元の画像</h3>
            <div className="w-24 h-24 bg-gray-900 rounded-lg p-1">
                 <img src={gijimon.baseImage} alt="元の画像" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Pokedex: React.FC = () => {
  const { gijimons } = useGameState();
  const [selectedGijimon, setSelectedGijimon] = useState<Gijimon | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.newGijimonId) {
      const newGijimon = gijimons.find(g => g.id === location.state.newGijimonId);
      if (newGijimon) {
        setSelectedGijimon(newGijimon);
        // Clear the state to prevent the modal from re-appearing on navigation
        navigate(location.pathname, { replace: true });
      }
    }
  }, [location.state, gijimons, navigate, location.pathname]);
  

  return (
    <div className="w-full h-full bg-gray-800 flex flex-col p-6 relative">
       {selectedGijimon && <GijimonDetailView gijimon={selectedGijimon} onClose={() => setSelectedGijimon(null)} />}
      <div className="flex-shrink-0 flex items-center mb-4">
        <button onClick={() => navigate('/menu')} className="text-xl font-bold text-white hover:text-yellow-400">
          {'<'} 戻る
        </button>
        <h1 className="text-3xl font-bold text-center text-white flex-grow font-dotgothic">擬似モン図鑑</h1>
      </div>
      
      {gijimons.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
            <p className="text-gray-400 text-lg">まだ擬似モンがいません。</p>
        </div>
      ) : (
        <div className="flex-grow overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 pr-2">
          {gijimons.map(gijimon => (
            <div key={gijimon.id} onClick={() => setSelectedGijimon(gijimon)} className="cursor-pointer aspect-square bg-gray-700 rounded-lg p-2 flex flex-col items-center justify-center hover:bg-gray-600 transition-colors">
              <img src={gijimon.gijimonImage} alt={gijimon.name} className="max-w-full max-h-20 object-contain" />
              <p className="text-xs text-center mt-1 font-bold truncate w-full">{gijimon.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Pokedex;
