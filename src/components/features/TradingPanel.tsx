import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface TradingPanelProps {
  onTrade?: (params: any) => void;
}

const TradingPanel: React.FC<TradingPanelProps> = ({ onTrade }) => {
  const [fromToken, setFromToken] = useState('SOL');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrade = async () => {
    if (!amount || !fromToken || !toToken) return;
    
    setIsLoading(true);
    try {
      await onTrade?.({
        fromToken,
        toToken,
        amount: parseFloat(amount),
        slippage: parseFloat(slippage),
      });
    } catch (error) {
      console.error('Trade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Trade</h2>
      
      <div className="space-y-4">
        {/* From Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From
          </label>
          <div className="flex space-x-2">
            <select
              value={fromToken}
              onChange={(e) => setFromToken(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="SOL">SOL</option>
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
              <option value="RAY">RAY</option>
              <option value="SRM">SRM</option>
            </select>
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-2"
            />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={swapTokens}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
              />
            </svg>
          </button>
        </div>

        {/* To Token */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To
          </label>
          <div className="flex space-x-2">
            <select
              value={toToken}
              onChange={(e) => setToToken(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="SOL">SOL</option>
              <option value="USDC">USDC</option>
              <option value="USDT">USDT</option>
              <option value="RAY">RAY</option>
              <option value="SRM">SRM</option>
            </select>
            <div className="flex-2 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500">
              ~0.0
            </div>
          </div>
        </div>

        {/* Slippage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slippage Tolerance (%)
          </label>
          <div className="flex space-x-2">
            {['0.1', '0.5', '1.0'].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={`px-3 py-1 text-sm rounded ${
                  slippage === value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {value}%
              </button>
            ))}
            <Input
              type="number"
              placeholder="Custom"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="w-20"
            />
          </div>
        </div>

        {/* Trade Info */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Rate</span>
            <span className="text-gray-900">1 {fromToken} = ~{Math.random().toFixed(4)} {toToken}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Price Impact</span>
            <span className="text-green-600">~0.01%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Network Fee</span>
            <span className="text-gray-900">~0.00025 SOL</span>
          </div>
        </div>

        {/* Trade Button */}
        <Button
          onClick={handleTrade}
          loading={isLoading}
          fullWidth
          disabled={!amount || !fromToken || !toToken}
        >
          {isLoading ? 'Trading...' : `Swap ${fromToken} for ${toToken}`}
        </Button>
      </div>
    </div>
  );
};

export default TradingPanel;
