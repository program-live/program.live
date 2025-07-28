import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { 
  getFearGreedIndexLevel, 
  getFearGreedIndexNeedleRotation, 
  getFearGreedIndexDisplayValue 
} from '@/lib/markets/fear-greed-index'

export async function FearGreedIndex() {
  const fearGreedData = await fetchQuery(api.fearGreedIndex.getFearGreedData);
  
  // Transform Convex data to match expected format
  const data = fearGreedData ? {
    value: fearGreedData.value,
    value_classification: fearGreedData.value_classification,
    timestamp: fearGreedData.timestamp,
    time_until_update: fearGreedData.time_until_update
  } : null;

  const level = getFearGreedIndexLevel(data)
  const needleRotation = getFearGreedIndexNeedleRotation(data)
  const displayValue = getFearGreedIndexDisplayValue(data)

  const getTextColor = () => {
    switch (level.color) {
      case "red":
        return "text-destructive"
      case "green": 
        return "text-success"
      default:
        return "text-neutral-300"
    }
  }

  return (
    <div className="relative flex justify-between items-baseline w-full h-15 gap-2">
      <p className="whitespace-nowrap">FEAR/GREED</p>

      <span className="w-full border-b border-dotted" />

      <div className="flex items-center gap-[0.35rem]">
        <div className={`whitespace-nowrap ${getTextColor()}`}>
          <span>
            {displayValue}{" "}
            {level.label}
          </span>
        </div>

        {/* Meter */}
        <div className="relative flex items-center justify-center w-[29px] h-15">
          {/* Arc */}
          <div className="absolute h-10 border-l border-r border-t border-dotted rounded-t-full w-20"></div>
          {/* Needle Arm */}
          <div
            className="absolute w-1 h-6 bottom-4 bg-foreground transition-transform duration-1000 rounded-full"
            style={{
              transform: `rotate(${needleRotation}deg)`,
              transformOrigin: "bottom center",
            }}
          />
          {/* Needle Dot */}
          <div className="absolute bottom-3 w-2 h-2 bg-foreground rounded-full" />
        </div>
      </div>
    </div>
  )
}
