import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { generateGijimonProperties, generateGijimonImage, fileToBase64, assembleGijimon } from '../services/geminiService';
import { useGameState } from '../context/GameStateContext';
import ProgressLoader from '../components/ProgressLoader';
import ErrorDisplay from '../components/ErrorDisplay';
import FileUploadArea from '../components/FileUploadArea';
import type { Gijimon } from '../types';

const CreateGijimon: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0); // 0: idle, 1-7: loading
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addGijimon } = useGameState();

  const LOADING_STEPS = [
    '画像をアップロード中...',
    '画像を分析中...',
    '擬似モンの特徴を決定中...',
    'ステータスを生成中...',
    '技を選択中...',
    '画像を生成中...',
    '擬似モンを保存中...'
  ];

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(URL.createObjectURL(file));
  }, [preview]);
  
  const handleCancel = useCallback(() => {
    setLoadingStep(0);
    // Note: This doesn't abort in-flight API requests
  }, []);

  const handleCreate = useCallback(async () => {
    if (!selectedFile) {
      setError('画像ファイルを選択してください。');
      return;
    }
    setError(null);
    setLoadingStep(1); // Start: Uploading

    try {
      const baseImage = await fileToBase64(selectedFile);
      
      setLoadingStep(2); // Analyzing
      const properties = await generateGijimonProperties(baseImage, selectedFile.type);
      
      // Simulate intermediate steps for better UX
      await new Promise(res => setTimeout(res, 300)); setLoadingStep(3);
      await new Promise(res => setTimeout(res, 300)); setLoadingStep(4);
      await new Promise(res => setTimeout(res, 300)); setLoadingStep(5);

      setLoadingStep(6); // Generating image
      const gijimonImage = await generateGijimonImage(properties.description, properties.type);
      
      const gijimonData = assembleGijimon(properties, baseImage, gijimonImage);
      
      const newGijimon: Gijimon = {
        ...gijimonData,
        id: uuidv4(),
        level: 5,
        exp: 0,
        expToNextLevel: 100,
        currentHp: gijimonData.stats.hp,
      };
      
      setLoadingStep(7); // Saving
      addGijimon(newGijimon);
      await new Promise(res => setTimeout(res, 500));

      navigate('/pokedex', { state: { newGijimonId: newGijimon.id } });

    } catch (err: any) {
      console.error(err);
      setError(err.message || '擬似モンの生成に失敗しました。');
      setLoadingStep(0);
    }
    // No finally block, success navigates away
  }, [selectedFile, addGijimon, navigate]);

  const isLoading = loadingStep > 0;

  return (
    <div className="w-full h-full bg-gray-800 flex flex-col p-6 relative">
      {isLoading && (
        <ProgressLoader 
          currentStep={loadingStep} 
          totalSteps={LOADING_STEPS.length}
          stepMessages={LOADING_STEPS}
          onCancel={handleCancel}
        />
      )}
      {error && <ErrorDisplay error={error} onRetry={handleCreate} onClose={() => setError(null)} />}
      
      <div className="flex-shrink-0 flex items-center mb-4">
        <button onClick={() => navigate('/menu')} className="text-xl font-bold text-white hover:text-yellow-400">
          {'<'} 戻る
        </button>
        <h1 className="text-3xl font-bold text-center text-white flex-grow font-dotgothic">擬似モン生成</h1>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center bg-gray-700 rounded-lg p-4">
        <div className="w-full max-w-md text-center">
            <FileUploadArea onFileSelect={handleFileSelect} onError={setError}>
                {preview ? (
                    <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain rounded-lg" />
                ) : (
                    <>
                        <div className="text-6xl mb-4" aria-hidden="true">📁</div>
                        <p className="text-gray-400 text-center">
                            画像をドラッグ&ドロップ<br />
                            またはクリックして選択
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            JPEG、PNG、WebP、GIF（最大5MB）
                        </p>
                    </>
                )}
            </FileUploadArea>
          
          {selectedFile && <p className="text-sm mt-2 text-gray-300">{selectedFile.name}</p>}

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
