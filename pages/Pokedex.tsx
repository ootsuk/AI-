import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameState } from '../context/GameStateContext';
import { Gijimon, Move, GijimonType } from '../types';
import TypeBadge from '../components/TypeBadge';
import StatDisplay from '../components/StatDisplay';

const GijimonDetailView: React.FC<{ gijimon: Gijimon; onClose: () => void }> = ({ gijimon, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-20 flex items-center justify-center p-2" onClick={onClose}>
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl border-4 border-gray-600 p-4 relative max-h-full overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-2 right-4 text-white text-3xl font-bold z-20" aria-label="閉じる">&times;</button>
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

const GijimonCard: React.FC<{ gijimon: Gijimon; viewMode: 'grid' | 'list'; onClick: () => void }> = ({ gijimon, viewMode, onClick }) => {
  if (viewMode === 'list') {
    return (
      <div onClick={onClick} className="cursor-pointer w-full bg-gray-700 rounded-lg p-2 flex items-center gap-4 hover:bg-gray-600 transition-colors">
        <img src={gijimon.gijimonImage} alt={gijimon.name} className="w-16 h-16 object-contain bg-gray-800 rounded-md flex-shrink-0" />
        <div className="flex-grow min-w-0">
          <p className="font-bold text-white truncate">{gijimon.name}</p>
          <p className="text-sm text-gray-400">Lv. {gijimon.level}</p>
        </div>
        <TypeBadge type={gijimon.type} />
      </div>
    );
  }

  // Grid view (default)
  return (
    <div onClick={onClick} className="cursor-pointer aspect-square bg-gray-700 rounded-lg p-2 flex flex-col items-center justify-center hover:bg-gray-600 transition-colors">
      <div className="w-full h-2/3 flex items-center justify-center">
        <img src={gijimon.gijimonImage} alt={gijimon.name} className="max-w-full max-h-full object-contain" />
      </div>
      <p className="text-xs text-center mt-1 font-bold truncate w-full">{gijimon.name}</p>
    </div>
  );
};


const Pokedex: React.FC = () => {
  const { gijimons } = useGameState();
  const [selectedGijimon, setSelectedGijimon] = useState<Gijimon | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'type'>('name');
  const [filterType, setFilterType] = useState<GijimonType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (location.state?.newGijimonId) {
      const newGijimon = gijimons.find(g => g.id === location.state.newGijimonId);
      if (newGijimon) {
        setSelectedGijimon(newGijimon);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, gijimons, navigate, location.pathname]);
  
  const filteredGijimons = useMemo(() => {
    return gijimons
      .filter(gijimon => {
        const matchesSearch = gijimon.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || gijimon.type === filterType;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name': return a.name.localeCompare(b.name);
          case 'level': return b.level - a.level;
          case 'type': return a.type.localeCompare(b.type);
          default: return 0;
        }
      });
  }, [gijimons, searchTerm, sortBy, filterType]);

  return (
    <div className="w-full h-full bg-gray-800 flex flex-col p-4 sm:p-6 relative">
      {selectedGijimon && <GijimonDetailView gijimon={selectedGijimon} onClose={() => setSelectedGijimon(null)} />}
      
      <div className="flex-shrink-0 flex items-center mb-4">
        <button onClick={() => navigate('/menu')} className="text-xl font-bold text-white hover:text-yellow-400 pr-4">{'<'}</button>
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-white flex-grow font-dotgothic">
          擬似モン図鑑 ({gijimons.length}匹)
        </h1>
      </div>

      <div className="flex-shrink-0 bg-gray-700 rounded-lg p-3 sm:p-4 mb-4 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="名前で検索..." className="col-span-2 md:col-span-1 w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value as GijimonType | 'all')} className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none">
            <option value="all">全タイプ</option>
            {Object.values(GijimonType).map(type => (<option key={type} value={type}>{type}</option>))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'name' | 'level' | 'type')} className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-blue-500 focus:outline-none">
            <option value="name">名前順</option>
            <option value="level">レベル順</option>
            <option value="type">タイプ順</option>
          </select>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('grid')} className={`w-full px-3 py-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}>Grid</button>
            <button onClick={() => setViewMode('list')} className={`w-full px-3 py-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-300'}`}>List</button>
          </div>
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {filteredGijimons.length === 0 ? (
          <div className="flex items-center justify-center h-full"><p className="text-gray-400 text-lg">擬似モンが見つかりません</p></div>
        ) : (
          <div className={`grid gap-3 ${viewMode === 'grid' ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5' : 'grid-cols-1'}`}>
            {filteredGijimons.map(gijimon => (<GijimonCard key={gijimon.id} gijimon={gijimon} viewMode={viewMode} onClick={() => setSelectedGijimon(gijimon)} />))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Pokedex;
