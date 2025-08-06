import React, { useState, useEffect } from 'react';
import './App.css';

// Simple loading screen component
const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 200);
          return 100;
        }
        return prev + Math.random() * 20 + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="https://i.ibb.co/ZBYLmzH/logo.png" 
            alt="Solana Bundler" 
            className="w-16 h-16 mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-white">Solana Bundler</h1>
          <p className="text-gray-300">Advanced Multi-Wallet Trading Platform</p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-gray-400">Loading... {Math.round(progress)}%</p>
      </div>
    </div>
  );
};

// Simple iframe component
const TradingInterface: React.FC = () => {
  const getIframeUrl = () => {
    const baseUrl = 'https://www.bundlerbot.fun';
    const params = new URLSearchParams({
      embedded: 'true',
      theme: 'dark',
      session: Date.now().toString(),
      version: '1.0.0'
    });
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <div className="w-full h-screen">
      <iframe
        src={getIframeUrl()}
        className="w-full h-full border-0"
        style={{
          width: '100vw',
          height: '100vh',
          border: 'none',
          margin: 0,
          padding: 0,
          overflow: 'hidden'
        }}
        title="Solana Bundler"
      />
    </div>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className="App">
      {isLoading ? (
        <LoadingScreen onComplete={handleLoadComplete} />
      ) : (
        <TradingInterface />
      )}
    </div>
  );
}

export default App;
