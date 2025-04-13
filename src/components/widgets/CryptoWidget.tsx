import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const cryptos = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 65432.10,
    change: 2.5
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3521.45,
    change: -1.2
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    price: 2.15,
    change: 5.8
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    price: 142.75,
    change: 3.7
  },
  {
    name: 'Polkadot',
    symbol: 'DOT',
    price: 23.45,
    change: -0.8
  }
];

export const CryptoWidget: React.FC = () => {
  return (
    <div className="p-1.5">
      <div className="space-y-1">
        {cryptos.map((crypto) => (
          <div
            key={crypto.symbol}
            className="flex items-center p-1.5 rounded-lg bg-black/5 hover:bg-black/8 transition-all duration-200 cursor-pointer group min-w-0"
          >
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <div className="w-5 h-5 flex-shrink-0 rounded-md bg-gradient-to-br from-black/10 to-black/5 flex items-center justify-center text-[9px] font-semibold">
                {crypto.symbol}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-medium leading-none mb-0.5 truncate">{crypto.name}</div>
                <div className="text-[9px] opacity-60 leading-none truncate">${crypto.price.toLocaleString()}</div>
              </div>
            </div>
            <div className={`px-1.5 py-0.5 ml-1.5 flex-shrink-0 rounded text-[9px] font-medium flex items-center gap-0.5 ${crypto.change >= 0 ? 'text-green-600 bg-green-500/10' : 'text-red-600 bg-red-500/10'}`}>
              {crypto.change >= 0 ? (
                <TrendingUp size={10} />
              ) : (
                <TrendingDown size={10} />
              )}
              {Math.abs(crypto.change)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
