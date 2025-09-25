import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
  onClose: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry, onClose }) => {
  const getErrorInfo = (error: string) => {
    if (error.includes('API_KEY')) {
      return {
        title: 'APIキーが設定されていません',
        message: 'アプリケーションが正しく設定されていません。管理者にお問い合わせください。',
        icon: '🔑',
        canRetry: false
      };
    } else if (error.includes('quota')) {
      return {
        title: 'APIの利用制限に達しました',
        message: '現在、多くのリクエストが集中しています。しばらく待ってから再試行してください。',
        icon: '⏰',
        canRetry: true
      };
    } else if (error.includes('network') || error.includes('Failed to fetch')) {
      return {
        title: 'ネットワークエラー',
        message: 'インターネット接続を確認し、もう一度お試しください。',
        icon: '🌐',
        canRetry: true
      };
    } else if (error.includes('file')) {
      return {
        title: 'ファイルの処理に失敗しました',
        message: 'ファイルが破損しているか、サポートされていない形式の可能性があります。別の画像をお試しください。',
        icon: '📁',
        canRetry: true
      };
    }
    return {
      title: '予期せぬエラーが発生しました',
      message: '問題が発生しました。時間をおいて再度お試しください。',
      icon: '⚠️',
      canRetry: true
    };
  };

  const errorInfo = getErrorInfo(error);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 border-2 border-red-500 rounded-lg p-6 max-w-md w-full mx-4 text-white">
        <div className="text-center">
          <div className="text-6xl mb-4" role="img" aria-label={errorInfo.title}>{errorInfo.icon}</div>
          <h3 className="text-xl font-bold text-red-400 mb-2">
            {errorInfo.title}
          </h3>
          <p className="text-gray-300 mb-6">{errorInfo.message}</p>
          
          <div className="flex gap-3 justify-center">
            {errorInfo.canRetry && (
              <button
                onClick={onRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                再試行
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
