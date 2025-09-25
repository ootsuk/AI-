
import React, { useState, useEffect } from 'react';

interface MessageBoxProps {
  message: string;
  onFinished?: () => void;
}

const MessageBox: React.FC<MessageBoxProps> = ({ message, onFinished }) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setDisplayedMessage('');
    setIsFinished(false);
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < message.length) {
        setDisplayedMessage(prev => prev + message.charAt(i));
        i++;
      } else {
        clearInterval(intervalId);
        setIsFinished(true);
        if (onFinished) {
          onFinished();
        }
      }
    }, 50);

    return () => clearInterval(intervalId);
  }, [message, onFinished]);
  
  const handleClick = () => {
      if (!isFinished) {
          setDisplayedMessage(message);
          setIsFinished(true);
      }
  }

  return (
    <div className="w-full h-28 bg-white border-4 border-blue-800 rounded-lg p-3 text-black text-lg font-bold shadow-inner relative" onClick={handleClick}>
      <p>{displayedMessage}</p>
      {isFinished && <div className="absolute bottom-2 right-4 animate-bounce">▼</div>}
    </div>
  );
};

export default MessageBox;
