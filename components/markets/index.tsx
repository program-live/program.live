import { FearGreedIndex } from '@/components/markets/fear-greed-index';
import StockQuotes from '@/components/markets/stock-quotes';
import CryptoQuotes from '@/components/markets/crypto-quotes';

export default function Markets() {
  return (
    <>
      <FearGreedIndex />
      <CryptoQuotes />
      <StockQuotes />
    </>
  );
} 