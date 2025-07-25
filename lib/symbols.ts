// lib/symbols.ts – Structured symbol configuration

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
