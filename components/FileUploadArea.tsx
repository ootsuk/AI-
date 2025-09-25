import React, { useState, useCallback } from 'react';

interface FileUploadAreaProps {
  onFileSelect: (file: File) => void;
  onError: (message: string) => void;
  children: React.ReactNode;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onFileSelect, onError, children }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);
  
  const validateAndProcessFile = useCallback((file: File) => {
    // ファイルサイズチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      onError('ファイルサイズが大きすぎます（最大5MB）');
      return false;
    }

    // ファイル形式チェック
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      onError('対応していないファイル形式です（JPEG、PNG、WebP、GIFのみ）');
      return false;
    }
    
    onError(''); // Clear previous errors
    onFileSelect(file);
    return true;
  }, [onFileSelect, onError]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      validateAndProcessFile(files[0]);
    }
  }, [validateAndProcessFile]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
     // Reset the input value to allow selecting the same file again
    e.target.value = '';
  };

  return (
    <div
      className={`relative w-full aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
        isDragOver 
          ? 'border-blue-400 bg-gray-700' 
          : 'border-gray-500 bg-gray-900'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
        <label
            htmlFor="file-upload"
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4"
        >
            {children}
        </label>
        <input id="file-upload" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
    </div>
  );
};

export default FileUploadArea;
