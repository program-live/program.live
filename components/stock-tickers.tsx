"use client";

import { StockData } from '@/lib/markets/tickers';
import ScrollingText from './scrolling-text';

interface StockTickersProps {
  data: StockData;
}

export default function StockTickers({ data }: StockTickersProps) {
  const { topTechStocks, otherStocksUp, otherStocksDown } = data;

  return (
    <div>
      {/* Top Stocks */}
      <div>
        {topTechStocks.map((stock, i) => (
          <div key={i} className="w-full flex items-baseline justify-between gap-0.5">
            <span>{stock.ticker}</span>
            <span className="w-full border-b border-dotted" />
            <div className="whitespace-nowrap">
              <span>${stock.price}</span>{" "}
              <span className={stock.movement > 0 ? "text-[#8dd324]" : "text-[#FF0066]"}>
                {stock.movement > 0 ? "▴" : '▾'}{(Math.abs(stock.movement) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Tickers Up */}
      <div className="h-[15px]">
        <ScrollingText direction="right" speed={100}>
          {otherStocksUp.map((stock, i) => (
            <span key={i}>
              {stock.ticker} ${stock.price}
              {'\u00A0'}
              <span className="text-[#8dd324]">
                <span className="">▴</span>
                {(stock.movement * 100).toFixed(1)}%
              </span>
              {'\u00A0'}
            </span>
          ))}
        </ScrollingText>
      </div>

      {/* Stock Tickers Down */}
      <div className="h-[15px]">
        <ScrollingText direction="left" speed={100}>
          {otherStocksDown.map((stock, i) => (
            <span key={i}>
              {stock.ticker} ${stock.price}
              {'\u00A0'}
              <span className="text-[#FF0066]">▾{(stock.movement * 100 * -1).toFixed(1)}%</span>
              {'\u00A0'}
            </span>
          ))}
        </ScrollingText>
      </div>
    </div>
  );
} 