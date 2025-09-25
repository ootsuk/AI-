
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { createGijimonFromImage } from '../services/geminiService';
import { useGameState } from '../context/GameStateContext';
import LoadingOverlay from '../components/LoadingOverlay';
import type { Gijimon } from '../types';

const CreateGijimon: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const navigate = useNavigate();
  const { addGijimon } = useGameState();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleCreate = async () => {
    if (!selectedFile) {
      setError('画像ファイルを選択してください。');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setLoadingMessage('画像を分析中...');
      const gijimonData = await createGijimonFromImage(selectedFile);
      
      const newGijimon: Gijimon = {
        ...gijimonData,
        id: uuidv4(),
        level: 5,
        exp: 0,
        expToNextLevel: 100,
        currentHp: gijimonData.stats.hp,
      };
      
      setLoadingMessage('擬似モンを保存中...');
      addGijimon(newGijimon);

      navigate('/pokedex', { state: { newGijimonId: newGijimon.id } });

    } catch (err) {
      console.error(err);
      setError('擬似モンの生成に失敗しました。時間をおいて再度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gray-800 flex flex-col p-6 relative">
      {isLoading && <LoadingOverlay message={loadingMessage} />}
      <div className="flex-shrink-0 flex items-center mb-4">
        <button onClick={() => navigate('/menu')} className="text-xl font-bold text-white hover:text-yellow-400">
          {'<'} 戻る
        </button>
        <h1 className="text-3xl font-bold text-center text-white flex-grow font-dotgothic">擬似モン生成</h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center bg-gray-700 rounded-lg p-4">
        <div className="w-full max-w-md text-center">
          <div className="w-full aspect-square bg-gray-900 rounded-lg mb-4 flex items-center justify-center border-2 border-dashed border-gray-500">
            {preview ? (
              <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
            ) : (
              <p className="text-gray-400">画像を選択してください</p>
            )}
          </div>

          <label htmlFor="file-upload" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            ファイルを選択
          </label>
          <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          
          {selectedFile && <p className="text-sm mt-2">{selectedFile.name}</p>}

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </div>
      
      <div className="flex-shrink-0 mt-6">
        <button
          onClick={handleCreate}
          disabled={!selectedFile || isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold text-2xl py-4 rounded-lg border-b-4 border-green-800 disabled:border-gray-600 active:border-b-0 transition-all"
        >
          生成する！
        </button>
      </div>
    </div>
  );
};

export default CreateGijimon;
