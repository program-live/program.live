import { CryptoData } from '@/lib/markets/tickers';

export default function CryptoTickers({ data }: { data: CryptoData }) {
  const { topCrypto } = data;

  return (
    <div>
      {topCrypto.map((crypto, i) => (
        <div key={i} className="w-full flex items-baseline justify-between gap-0.5">
          <span>{crypto.ticker}</span>
          <span className="w-full border-b border-dotted" />
          <div className="whitespace-nowrap">
            <span>${crypto.price}</span>{" "}
            <span className={crypto.movement > 0 ? "text-[#8dd324]" : "text-[#FF0066]"}>
              {crypto.movement > 0 ? "▴" : '▾'}{(Math.abs(crypto.movement) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      ))}  
    </div>
  );
} 