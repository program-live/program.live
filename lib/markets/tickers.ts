// Types for ticker data
export interface TickerData {
  ticker: string;
  price: number;
  movement: number; // percentage change as decimal (e.g., 0.023 for 2.3%)
}

export interface StockData {
  topTechStocks: TickerData[];
  otherStocksUp: TickerData[];
  otherStocksDown: TickerData[];
}

export interface CryptoData {
  topCrypto: TickerData[];
}

// API response interfaces
interface FMPQuoteShortResponse {
  symbol: string;
  price: number;
  change: number;
  volume: number;
}

interface FMPGainerLoserResponse {
  symbol: string;
  name: string;
  change: number;
  price: number;
  changesPercentage: number;
}

// Fixed lists of symbols to track (these are always shown)
const TOP_TECH_STOCKS = ['NVDA', 'GOOGL', 'MSFT', 'AMZN', 'META'];
const TOP_CRYPTO = ['BTCUSD', 'ETHUSD', 'XRPUSD', 'BNBUSD', 'SOLUSD'];

const API_KEY = process.env.FMP_API_KEY;
const BASE_URL = 'https://financialmodelingprep.com/stable';

if (!API_KEY) {
  throw new Error('FMP_API_KEY environment variable is required');
}

// Helper function to convert FMP short quote response to our TickerData format
function convertShortQuoteToTickerData(quote: FMPQuoteShortResponse): TickerData {
  // Convert crypto symbols back to display format (remove USD suffix)
  const displayTicker = quote.symbol.endsWith('USD') && quote.symbol.length > 3 
    ? quote.symbol.slice(0, -3) 
    : quote.symbol;

  // Calculate percentage change from change and price
  let movement = 0;
  if (quote.price && quote.change && quote.price > 0) {
    movement = quote.change / (quote.price - quote.change); // change / previous_price
  }

  return {
    ticker: displayTicker,
    price: Number((quote.price || 0).toFixed(2)),
    movement,
  };
}

// Helper function to convert gainer/loser response to our TickerData format
function convertGainerLoserToTickerData(item: FMPGainerLoserResponse): TickerData {
  const displayTicker = item.symbol.endsWith('USD') && item.symbol.length > 3 
    ? item.symbol.slice(0, -3) 
    : item.symbol;

  // Handle potential null/undefined/NaN values for changesPercentage
  let movement = 0;
  if (item.changesPercentage !== null && 
      item.changesPercentage !== undefined && 
      !isNaN(item.changesPercentage)) {
    movement = item.changesPercentage / 100;
  }

  return {
    ticker: displayTicker,
    price: item.price || 0,
    movement,
  };
}

// Fetch individual stock quote using quote-short
async function fetchStockQuote(symbol: string): Promise<FMPQuoteShortResponse> {
  const url = `${BASE_URL}/quote-short?symbol=${symbol}&apikey=${API_KEY}`;
  
  const response = await fetch(url, {
    next: { revalidate: 600 }, // Revalidate every 10 minutes
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch quote for ${symbol}: ${response.statusText}`);
  }

  const data = await response.json();
  const quote = Array.isArray(data) ? data[0] : data;
  
  return quote;
}

// Fetch multiple stock quotes individually
async function fetchStockQuotes(symbols: string[]): Promise<FMPQuoteShortResponse[]> {
  const promises = symbols.map(symbol => fetchStockQuote(symbol));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter((result): result is PromiseFulfilledResult<FMPQuoteShortResponse> => result.status === 'fulfilled')
    .map(result => result.value);
}

// Fetch top stock gainers
async function fetchStockGainers(): Promise<FMPGainerLoserResponse[]> {
  const url = `${BASE_URL}/biggest-gainers?apikey=${API_KEY}`;
  
  const response = await fetch(url, {
    next: { revalidate: 600 }, // Revalidate every 10 minutes
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stock gainers: ${response.statusText}`);
  }

  return response.json();
}

// Fetch top stock losers
async function fetchStockLosers(): Promise<FMPGainerLoserResponse[]> {
  const url = `${BASE_URL}/biggest-losers?apikey=${API_KEY}`;
  
  const response = await fetch(url, {
    next: { revalidate: 600 }, // Revalidate every 10 minutes
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch stock losers: ${response.statusText}`);
  }

  return response.json();
}

// Fetch individual crypto quote using quote-short
async function fetchCryptoQuote(symbol: string): Promise<FMPQuoteShortResponse> {
  const url = `${BASE_URL}/quote-short?symbol=${symbol}&apikey=${API_KEY}`;
  
  const response = await fetch(url, {
    next: { revalidate: 600 }, // Revalidate every 10 minutes
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch crypto quote for ${symbol}: ${response.statusText}`);
  }

  const data = await response.json();
  const quote = Array.isArray(data) ? data[0] : data;
  
  return quote;
}

// Fetch multiple crypto quotes individually
async function fetchCryptoQuotes(symbols: string[]): Promise<FMPQuoteShortResponse[]> {
  const promises = symbols.map(symbol => fetchCryptoQuote(symbol));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter((result): result is PromiseFulfilledResult<FMPQuoteShortResponse> => result.status === 'fulfilled')
    .map(result => result.value);
}

// Main function to fetch stock data
export async function fetchStockData(): Promise<StockData> {
  try {
    // Fetch fixed top tech stocks and market gainers/losers in parallel
    const [topTechQuotes, gainers, losers] = await Promise.all([
      fetchStockQuotes(TOP_TECH_STOCKS),
      fetchStockGainers(),
      fetchStockLosers(),
    ]);
    
    // Convert top tech stocks
    const topTechStocks = topTechQuotes.map(convertShortQuoteToTickerData);
    
    // Filter out any top tech stocks from gainers/losers to avoid duplicates
    const filteredGainers = gainers.filter(item => !TOP_TECH_STOCKS.includes(item.symbol));
    const filteredLosers = losers.filter(item => !TOP_TECH_STOCKS.includes(item.symbol));
    
    // Convert gainers/losers (take first 15 of each for the ticker)
    const otherStocksUp = filteredGainers.slice(0, 15).map(convertGainerLoserToTickerData);
    const otherStocksDown = filteredLosers.slice(0, 15).map(convertGainerLoserToTickerData);
    
    return {
      topTechStocks,
      otherStocksUp,
      otherStocksDown,
    };
  } catch (error) {
    console.error('Error fetching stock data:', error);
    
    // Return fallback data if API fails
    return {
      topTechStocks: [
        { ticker: "AAPL", price: 182.45, movement: 0.023 },
        { ticker: "GOOGL", price: 138.21, movement: 0.018 },
        { ticker: "MSFT", price: 376.89, movement: 0.031 },
        { ticker: "AMZN", price: 155.72, movement: 0.027 },
        { ticker: "TSLA", price: 248.33, movement: -0.012 }
      ],
      otherStocksUp: [
        { ticker: "NVDA", price: 421.33, movement: 0.045 },
        { ticker: "AMD", price: 102.67, movement: 0.033 },
        { ticker: "ORCL", price: 98.45, movement: 0.021 },
        { ticker: "CRM", price: 234.56, movement: 0.028 },
        { ticker: "ADBE", price: 367.89, movement: 0.019 },
        { ticker: "INTC", price: 45.23, movement: 0.015 }
      ],
      otherStocksDown: [
        { ticker: "META", price: 284.91, movement: -0.014 },
        { ticker: "NFLX", price: 478.12, movement: -0.021 },
        { ticker: "DIS", price: 89.56, movement: -0.008 },
        { ticker: "PYPL", price: 58.73, movement: -0.032 },
        { ticker: "UBER", price: 71.24, movement: -0.017 },
        { ticker: "SNAP", price: 12.34, movement: -0.025 },
        { ticker: "TWTR", price: 23.45, movement: -0.019 }
      ]
    };
  }
}

// Main function to fetch crypto data
export async function fetchCryptoData(): Promise<CryptoData> {
  try {
    // Fetch only the top crypto quotes
    const topCryptoQuotes = await fetchCryptoQuotes(TOP_CRYPTO);
    
    // Convert to ticker data format
    const topCrypto = topCryptoQuotes.map(convertShortQuoteToTickerData);
    
    return {
      topCrypto,
    };
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    
    // Return fallback data if API fails
    return {
      topCrypto: [
        { ticker: "BTC", price: 67420.35, movement: 0.042 },
        { ticker: "ETH", price: 3245.78, movement: 0.038 },
        { ticker: "XRP", price: 0.52, movement: 0.071 },
        { ticker: "BNB", price: 35.67, movement: 0.053 },
        { ticker: "SOL", price: 160.67, movement: 0.029 }
      ],
    };
  }
}

// Combined fetch function for convenience
export async function fetchAllTickerData(): Promise<{ stockData: StockData; cryptoData: CryptoData }> {
  const [stockData, cryptoData] = await Promise.all([
    fetchStockData(),
    fetchCryptoData(),
  ]);

  return { stockData, cryptoData };
} 