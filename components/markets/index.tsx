import { fetchFearGreedIndexData } from '@/lib/markets/fear-greed-index';
import { fetchAllTickerData } from '@/lib/markets/tickers';
import { FearGreedIndex } from '@/components/markets/fear-greed-index';
import StockTickers from '@/components/markets/stock-tickers';
import CryptoTickers from '@/components/markets/crypto-tickers';

export default async function Markets() {
  const [fearGreedIndexData, tickerData] = await Promise.all([
    fetchFearGreedIndexData(),
    fetchAllTickerData(),
  ]);
  
  return (
    <>
      <FearGreedIndex data={fearGreedIndexData} />
      <CryptoTickers data={tickerData.cryptoData} />
      <StockTickers data={tickerData.stockData} />
    </>
  );
} 