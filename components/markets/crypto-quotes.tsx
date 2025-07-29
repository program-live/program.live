import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import ScrollingText from '@/components/scrolling-text';

// Helper function to clean crypto symbol names
function cleanCryptoSymbol(symbol: string): string {
  return symbol
    .replace('BINANCE:', '')  // Remove exchange prefix
    .replace('USDT', '');     // Remove USDT suffix
}

export default async function Crypto() {
  const highlights = await fetchQuery(api.quotes.getHighlights, { kind: "crypto" });
  const tickerItems = await fetchQuery(api.quotes.getTickerTape, { kind: "crypto" });

  // Split ticker items into two halves for two scrolling lines
  const midpoint = Math.ceil(tickerItems.length / 2);
  const tickerLine1 = tickerItems.slice(0, midpoint);
  const tickerLine2 = tickerItems.slice(midpoint);

  return (
    <div>
      {/* HIGHLIGHTS: 5 crypto shown individually */}
      <div>
        {highlights.map((crypto) => (
          <div key={crypto.symbol} className="w-full flex items-baseline justify-between gap-2">
            <span>{cleanCryptoSymbol(crypto.symbol)}</span>
            <span className="w-full border-b border-dotted" />
            <div className="whitespace-nowrap">
              <span>${crypto.price.toFixed(2)}</span>{" "}
              <span className={crypto.changePct > 0 ? "text-success" : "text-destructive"}>
                {crypto.changePct > 0 ? "▴" : '▾'}{(Math.abs(crypto.changePct)).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* TICKER TAPE: Line 1 - scrolling right */}
      <div className="h-15">
        <ScrollingText direction="right" speed={100}>
          {tickerLine1.map((crypto, i) => (
            <span key={i}>
              {cleanCryptoSymbol(crypto.symbol)} ${crypto.price.toFixed(2)}
              {'\u00A0'}
              <span className={crypto.changePct > 0 ? "text-success" : "text-destructive"}>
                <span className="">{crypto.changePct > 0 ? "▴" : '▾'}</span>
                {(Math.abs(crypto.changePct)).toFixed(1)}%
              </span>
              {'\u00A0'}
            </span>
          ))}
        </ScrollingText>
      </div>

      {/* TICKER TAPE: Line 2 - scrolling left */}
      <div className="h-15">
        <ScrollingText direction="left" speed={100}>
          {tickerLine2.map((crypto, i) => (
            <span key={i}>
              {cleanCryptoSymbol(crypto.symbol)} ${crypto.price.toFixed(2)}
              {'\u00A0'}
              <span className={crypto.changePct > 0 ? "text-success" : "text-destructive"}>
                <span className="">{crypto.changePct > 0 ? "▴" : '▾'}</span>
                {(Math.abs(crypto.changePct)).toFixed(1)}%
              </span>
              {'\u00A0'}
            </span>
          ))}
        </ScrollingText>
      </div>
    </div>
  );
}