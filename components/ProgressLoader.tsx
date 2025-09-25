import React from 'react';

interface ProgressLoaderProps {
  currentStep: number;
  totalSteps: number;
  stepMessages: string[];
  onCancel: () => void;
}

const ProgressLoader: React.FC<ProgressLoaderProps> = ({ 
  currentStep, 
  totalSteps, 
  stepMessages,
  onCancel
}) => {
  const progress = ((currentStep - 1) / totalSteps) * 100;

  return (
    <div className="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          擬似モンを生成中...
        </h3>
        
        {/* プログレスバー */}
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* ステップ表示 */}
        <div className="space-y-2">
          {stepMessages.map((message, index) => (
            <div 
              key={index}
              className={`flex items-center text-sm transition-colors ${
                index < currentStep - 1
                  ? 'text-green-400' 
                  : index === currentStep - 1
                    ? 'text-blue-400' 
                    : 'text-gray-500'
              }`}
            >
              <div className={`w-4 h-4 rounded-full mr-3 flex-shrink-0 transition-all ${
                index < currentStep - 1
                  ? 'bg-green-400' 
                  : index === currentStep - 1
                    ? 'bg-blue-400 animate-pulse' 
                    : 'bg-gray-600'
              }`} />
              {message}
            </div>
          ))}
        </div>
        
        {/* キャンセルボタン */}
        <button 
          onClick={onCancel}
          className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          aria-label="生成をキャンセル"
        >
          キャンセル
        </button>
      </div>
    </div>
  );
};

export default ProgressLoader;
