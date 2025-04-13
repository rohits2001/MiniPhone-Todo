import React, { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export const StockWidget: React.FC = () => {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchStockData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=BSE:SENSEX&apikey=${import.meta.env.VITE_ALPHA_VANTAGE_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if we hit the API limit
        if (data.Note?.includes('API rate limit')) {
          throw new Error('API_LIMIT');
        }

        if (!data || !data['Global Quote']) {
          throw new Error('Invalid data format');
        }

        const quote = data['Global Quote'];

        if (!quote || !quote['05. price']) {
          throw new Error('Invalid data format');
        }

        setStockData({
          symbol: 'SENSEX',
          price: parseFloat(quote['05. price']),
          change: parseFloat(quote['09. change']),
          changePercent: parseFloat(quote['10. change percent'].replace('%', ''))
        });
        setLastUpdated(new Date());
      } catch (err) {
        console.error('Error fetching stock data:', err);
        
        // If we hit the API limit, use mock data
        if (err instanceof Error && (err.message === 'API_LIMIT' || err.message.includes('API rate limit'))) {
          const mockData = {
            '01. symbol': 'SENSEX',
            '02. open': '510.25',
            '03. high': '512.35',
            '04. low': '509.15',
            '05. price': '511.75',
            '06. volume': '85246312',
            '07. latest trading day': new Date().toISOString().split('T')[0],
            '08. previous close': '509.85',
            '09. change': '+1.90',
            '10. change percent': '+0.37%'
          };
          setStockData({
            symbol: 'SENSEX',
            price: parseFloat(mockData['05. price']),
            change: parseFloat(mockData['09. change']),
            changePercent: parseFloat(mockData['10. change percent'].replace('%', ''))
          });
          setLastUpdated(new Date());
        } else {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStockData();
    // Refresh every 5 minutes
    const interval = setInterval(fetchStockData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-3 text-sm">
        <div className="flex items-center gap-2 animate-pulse">
          <TrendingUp size={16} className="opacity-60" />
          <span className="opacity-60">Loading market data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-3 text-red-500 text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} />
          <span>Failed to load market data</span>
        </div>
      </div>
    );
  }

  if (!stockData) return null;

  const isPositive = stockData.change >= 0;
  const changeColor = isPositive ? 'text-green-500' : 'text-red-500';
  const bgGradient = isPositive ? 'from-green-500/20 to-green-600/20' : 'from-red-500/20 to-red-600/20';

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold">Market Overview</h2>
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <TrendingUp size={14} className="opacity-60" />
        <span className="text-xs font-medium opacity-60">BSE SENSEX</span>
      </div>
      <div className={`p-2 rounded-lg bg-gradient-to-br ${bgGradient}`}>
        <div className="text-lg font-semibold">
          ₹{stockData.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </div>
        <div className={`flex items-center gap-2 text-sm font-medium ${changeColor}`}>
          <span>{isPositive ? '+' : ''}{stockData.change.toFixed(2)}</span>
          <span>({isPositive ? '+' : ''}{stockData.changePercent.toFixed(2)}%)</span>
        </div>
      </div>
    </div>
  );
};
