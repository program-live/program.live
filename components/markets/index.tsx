import StockQuotes from '@/components/markets/stock-quotes';
import CryptoQuotes from '@/components/markets/crypto-quotes';

export default function Markets() {
  return (
    <>
      <CryptoQuotes />
      <StockQuotes />
    </>
  );
} 