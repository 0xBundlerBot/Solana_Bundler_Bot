import React, { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

interface Wallet {
  id: string;
  address: string;
  balance: number;
  selected: boolean;
}

interface BundleCreatorProps {
  onCreateBundle?: (config: any) => void;
}

const BundleCreator: React.FC<BundleCreatorProps> = ({ onCreateBundle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenAddress, setTokenAddress] = useState('');
  const [buyAmount, setBuyAmount] = useState('');
  const [sellPercentage, setSellPercentage] = useState('100');
  const [priorityFee, setPriorityFee] = useState('0.001');
  const [slippage, setSlippage] = useState('1.0');
  const [wallets, setWallets] = useState<Wallet[]>([
    { id: '1', address: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', balance: 1.5, selected: true },
    { id: '2', address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM', balance: 2.3, selected: true },
    { id: '3', address: 'DQyrAcCrDXQ7NeoqGgDCZwBvWDcYmFCjSb9JtteuvPpz', balance: 0.8, selected: false },
  ]);

  const toggleWalletSelection = (id: string) => {
    setWallets(prev => prev.map(wallet => 
      wallet.id === id ? { ...wallet, selected: !wallet.selected } : wallet
    ));
  };

  const selectedWallets = wallets.filter(w => w.selected);
  const totalBalance = selectedWallets.reduce((sum, w) => sum + w.balance, 0);

  const handleCreateBundle = () => {
    const config = {
      tokenAddress,
      buyAmount: parseFloat(buyAmount),
      sellPercentage: parseFloat(sellPercentage),
      priorityFee: parseFloat(priorityFee),
      slippage: parseFloat(slippage),
      wallets: selectedWallets.map(w => w.address),
    };
    
    onCreateBundle?.(config);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Bundle Creator</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            Create New Bundle
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Active Wallets</div>
            <div className="text-2xl font-bold text-blue-900">{selectedWallets.length}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Total Balance</div>
            <div className="text-2xl font-bold text-green-900">{totalBalance.toFixed(2)} SOL</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">Bundles Created</div>
            <div className="text-2xl font-bold text-purple-900">12</div>
          </div>
        </div>

        {/* Recent Bundles */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Bundles</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">Bundle #{i}</div>
                  <div className="text-sm text-gray-500">
                    {selectedWallets.length} wallets • {Math.random().toFixed(2)} SOL each
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Completed
                  </span>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Bundle Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Bundle"
        size="lg"
      >
        <div className="space-y-6">
          {/* Token Configuration */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Token Configuration</h4>
            <div className="space-y-4">
              <Input
                label="Token Address"
                placeholder="Enter token mint address"
                value={tokenAddress}
                onChange={(e) => setTokenAddress(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Buy Amount (SOL per wallet)"
                  type="number"
                  placeholder="0.1"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                />
                <Input
                  label="Sell Percentage (%)"
                  type="number"
                  placeholder="100"
                  value={sellPercentage}
                  onChange={(e) => setSellPercentage(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Priority Fee (SOL)"
                  type="number"
                  placeholder="0.001"
                  value={priorityFee}
                  onChange={(e) => setPriorityFee(e.target.value)}
                />
                <Input
                  label="Slippage (%)"
                  type="number"
                  placeholder="1.0"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Wallet Selection */}
          <div>
            <h4 className="text-lg font-medium text-gray-900 mb-4">Select Wallets</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {wallets.map((wallet) => (
                <div
                  key={wallet.id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    wallet.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleWalletSelection(wallet.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={wallet.selected}
                      onChange={() => toggleWalletSelection(wallet.id)}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {wallet.address.slice(0, 8)}...{wallet.address.slice(-8)}
                      </div>
                      <div className="text-sm text-gray-500">{wallet.balance} SOL</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Bundle Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Wallets:</span>
                <span className="text-gray-900">{selectedWallets.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Investment:</span>
                <span className="text-gray-900">
                  {(parseFloat(buyAmount || '0') * selectedWallets.length).toFixed(2)} SOL
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Fees:</span>
                <span className="text-gray-900">
                  {(parseFloat(priorityFee || '0') * selectedWallets.length).toFixed(4)} SOL
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateBundle}
              disabled={!tokenAddress || !buyAmount || selectedWallets.length === 0}
            >
              Create Bundle
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BundleCreator;
