
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import TitleScreen from './pages/TitleScreen';
import MainMenu from './pages/MainMenu';
import CreateGijimon from './pages/CreateGijimon';
import Pokedex from './pages/Pokedex';
import BattlePrepare from './pages/BattlePrepare';
import BattleScreen from './pages/BattleScreen';
import BattleResult from './pages/BattleResult';
import { GameStateProvider } from './context/GameStateContext';

const App: React.FC = () => {
  return (
    <GameStateProvider>
      <div className="w-full min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg mx-auto bg-black border-8 border-gray-600 rounded-2xl shadow-2xl flex flex-col h-[95vh] max-h-[900px] sm:max-w-4xl">
          <HashRouter>
            <Routes>
              <Route path="/" element={<TitleScreen />} />
              <Route path="/menu" element={<MainMenu />} />
              <Route path="/create" element={<CreateGijimon />} />
              <Route path="/pokedex" element={<Pokedex />} />
              <Route path="/battle/prepare" element={<BattlePrepare />} />
              <Route path="/battle/fight" element={<BattleScreen />} />
              <Route path="/battle/result" element={<BattleResult />} />
            </Routes>
          </HashRouter>
        </div>
      </div>
    </GameStateProvider>
  );
};

export default App;
