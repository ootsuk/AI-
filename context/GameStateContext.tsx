import React, { createContext, useState, useEffect, useContext, type ReactNode, useCallback } from 'react';
import type { Gijimon } from '../types';

interface GameState {
  gijimons: Gijimon[];
  addGijimon: (gijimon: Gijimon) => void;
  updateGijimon: (updatedGijimon: Gijimon) => void;
}

const GameStateContext = createContext<GameState | undefined>(undefined);

export const GameStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [gijimons, setGijimons] = useState<Gijimon[]>(() => {
    try {
      const savedGijimons = localStorage.getItem('gijimons');
      return savedGijimons ? JSON.parse(savedGijimons) : [];
    } catch (error) {
      console.error("Failed to parse gijimons from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('gijimons', JSON.stringify(gijimons));
    } catch (error) {
      console.error("Failed to save gijimons to localStorage", error);
    }
  }, [gijimons]);

  const addGijimon = useCallback((gijimon: Gijimon) => {
    setGijimons(prevGijimons => [...prevGijimons, gijimon]);
  }, []);

  const updateGijimon = useCallback((updatedGijimon: Gijimon) => {
    setGijimons(prevGijimons =>
      prevGijimons.map(g => (g.id === updatedGijimon.id ? updatedGijimon : g))
    );
  }, []);
  
  return (
    <GameStateContext.Provider value={{ gijimons, addGijimon, updateGijimon }}>
      {children}
    </GameStateContext.Provider>
  );
};

export const useGameState = (): GameState => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};