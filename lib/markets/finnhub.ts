// API for stock and crypto data

import { fetchJSON } from '../utils';

// HIGHLIGHTS: Always shown individually (5 stocks + 5 crypto)
export const STOCK_HIGHLIGHTS = ['NVDA', 'GOOGL', 'MSFT', 'AMZN', 'META'];
export const CRYPTO_HIGHLIGHTS = [
  'BINANCE:BTCUSDT',
  'BINANCE:ETHUSDT', 
  'BINANCE:XRPUSDT',
  'BINANCE:BNBUSDT',
  'BINANCE:SOLUSDT',
];

// TICKER TAPE: Additional symbols for scrolling ticker (can expand this list)
export const STOCK_TICKER_SYMBOLS = [
  'AAPL', 'TSLA', 'NFLX', 'AMD', 'INTC', 'CRM', 'ORCL', 'ADBE', 'UBER', 'SPOT'
];
export const CRYPTO_TICKER_SYMBOLS = [
  'BINANCE:ADAUSDT',
  'BINANCE:DOTUSDT', 
  'BINANCE:LINKUSDT',
  'BINANCE:MATICUSDT',
  'BINANCE:AVAXUSDT',
  'BINANCE:UNIUSDT',
  'BINANCE:LTCUSDT',
  'BINANCE:ATOMUSDT'
];

// Combined lists for API fetching
export const ALL_STOCK_SYMBOLS = [...STOCK_HIGHLIGHTS, ...STOCK_TICKER_SYMBOLS];
export const ALL_CRYPTO_SYMBOLS = [...CRYPTO_HIGHLIGHTS, ...CRYPTO_TICKER_SYMBOLS];
export const ALL_SYMBOLS = [...ALL_STOCK_SYMBOLS, ...ALL_CRYPTO_SYMBOLS];

const BASE_URL = 'https://finnhub.io/api/v1';

export async function getQuotes() {
  const KEY = process.env.FINNHUB_API_KEY;
  if (!KEY) {
    throw new Error('FINNHUB_API_KEY is not set');
  }

  const quotes = [];
  
  for (const symbol of ALL_SYMBOLS) {
    const url = `${BASE_URL}/quote?symbol=${symbol}&token=${KEY}`;
    const data = await fetchJSON(url);
    
    const kind = symbol.includes(':') ? 'crypto' as const : 'stock' as const;
    const isHighlight = kind === 'stock' 
      ? STOCK_HIGHLIGHTS.includes(symbol)
      : CRYPTO_HIGHLIGHTS.includes(symbol);
    
    quotes.push({
      symbol: symbol,
      price: data.c,
      changePct: data.dp,
      updated: Date.now(),
      kind,
      isHighlight,
    });
  }
  
  return quotes;
}
