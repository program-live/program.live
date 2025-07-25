import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import ScrollingText from '@/components/scrolling-text';

export default async function Stocks() {
  const highlights = await fetchQuery(api.quotes.getHighlights, { kind: "stock" });
  const tickerItems = await fetchQuery(api.quotes.getTickerTape, { kind: "stock" });

  // Split ticker items into two halves for two scrolling lines
  const midpoint = Math.ceil(tickerItems.length / 2);
  const tickerLine1 = tickerItems.slice(0, midpoint);
  const tickerLine2 = tickerItems.slice(midpoint);

  return (
    <div>
      {/* HIGHLIGHTS: 5 stocks shown individually */}
      <div>
        {highlights.map((stock) => (
          <div key={stock.symbol} className="w-full flex items-baseline justify-between gap-2">
            <span>{stock.symbol}</span>
            <span className="w-full border-b border-dotted" />
            <div className="whitespace-nowrap">
              <span>${stock.price.toFixed(2)}</span>{" "}
              <span className={stock.changePct > 0 ? "text-success" : "text-destructive"}>
                {stock.changePct > 0 ? "▴" : '▾'}{(Math.abs(stock.changePct)).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* TICKER TAPE: Line 1 - scrolling right */}
      <div className="h-15">
        <ScrollingText direction="left" speed={100}>
          {tickerLine1.map((stock, i) => (
            <span key={i}>
              {stock.symbol} ${stock.price.toFixed(2)}
              {'\u00A0'}
              <span className={stock.changePct > 0 ? "text-success" : "text-destructive"}>
                <span className="">{stock.changePct > 0 ? "▴" : '▾'}</span>
                {(Math.abs(stock.changePct)).toFixed(1)}%
              </span>
              {'\u00A0'}
            </span>
          ))}
        </ScrollingText>
      </div>

      {/* TICKER TAPE: Line 2 - scrolling left */}
      <div className="h-15">
        <ScrollingText direction="right" speed={100}>
          {tickerLine2.map((stock, i) => (
            <span key={i}>
              {stock.symbol} ${stock.price.toFixed(2)}
              {'\u00A0'}
              <span className={stock.changePct > 0 ? "text-success" : "text-destructive"}>
                <span className="">{stock.changePct > 0 ? "▴" : '▾'}</span>
                {(Math.abs(stock.changePct)).toFixed(1)}%
              </span>
              {'\u00A0'}
            </span>
          ))}
        </ScrollingText>
      </div>
    </div>
  );
}