import React, { useEffect, useState } from 'react';
import { Newspaper } from 'lucide-react';

interface NewsItem {
  title: string;
  category: string;
  color: string;
  textColor: string;
  url: string;
}

interface NewsArticle {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
  volume: string;
}

type AlphaVantageResponse = {
  top_gainers: NewsArticle[];
  top_losers: NewsArticle[];
  Note?: string;
  Information?: string;
  Message?: string;
}

const categoryColors: Record<string, { color: string; textColor: string }> = {
  gainer: { color: 'from-green-500/20 to-green-600/20', textColor: 'text-green-600' },
  loser: { color: 'from-red-500/20 to-red-600/20', textColor: 'text-red-600' },
  active: { color: 'from-blue-500/20 to-blue-600/20', textColor: 'text-blue-600' }
};



export const NewsWidget: React.FC = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiKey = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
        if (!apiKey) {
          throw new Error('API key not found');
        }

        // First try the real API
        const response = await fetch(
          `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: AlphaVantageResponse = await response.json();

        // Check if we hit the API limit
        if (data.Note?.includes('API rate limit')) {
          throw new Error('API_LIMIT');
        }

        if (!data || !data.top_gainers || !data.top_losers) {
          throw new Error('Invalid data format');
        }

        // Process market data
        const gainers = data.top_gainers || [];
        const losers = data.top_losers || [];

        if (!gainers.length && !losers.length) {
          console.error('No market data available:', JSON.stringify(data, null, 2));
          throw new Error('No market data available');
        }

        const processedNews = [...gainers.map((stock: NewsArticle) => ({
          title: `${stock.ticker} +${stock.change_percentage}`,
          category: 'gainer',
          ...categoryColors['gainer'],
          url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.ticker}&apikey=${apiKey}`
        })), ...losers.map((stock: NewsArticle) => ({
          title: `${stock.ticker} ${stock.change_percentage}`,
          category: 'loser',
          ...categoryColors['loser'],
          url: `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stock.ticker}&apikey=${apiKey}`
        }))].slice(0, 5);

        setNewsItems(processedNews);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching market data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch market data');
        setLoading(false);
      }
    };

    fetchNews();
    // Refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsClick = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 mb-3">
        <Newspaper size={16} />
        <span className="font-medium">Market Movers</span>
      </div>

      {error ? (
        <div className="text-sm text-red-500">
          <div className="flex items-center gap-2 mb-2">
            <span>Error loading market data</span>
          </div>
          <p className="text-xs opacity-75 whitespace-pre-wrap">{error}</p>
          <p className="text-xs mt-2">
            Note: If you're seeing a rate limit error, please wait a minute and try again.
          </p>
        </div>
      ) : loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : newsItems.length > 0 ? (
        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar-light">
          {newsItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleNewsClick(item.url)}
              className={`p-2 rounded-lg bg-gradient-to-r cursor-pointer ${item.color} hover:opacity-80 transition-opacity`}
            >
              <h3 className={`text-sm font-medium mb-1 line-clamp-2 ${item.textColor}`}>
                {item.title}
              </h3>
              <span className={`text-xs ${item.textColor} opacity-75`}>
                {item.category}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 text-center py-4">
          No market data available
        </div>
      )}
    </div>
  );
};
