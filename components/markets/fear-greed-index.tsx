import { 
  FearGreedIndexData,
  getFearGreedIndexLevel, 
  getFearGreedIndexNeedleRotation, 
  getFearGreedIndexDisplayValue 
} from '@/lib/markets/fear-greed-index'

export function FearGreedIndex({ data }: { data: FearGreedIndexData | null }) {
  const level = getFearGreedIndexLevel(data)
  const needleRotation = getFearGreedIndexNeedleRotation(data)
  const displayValue = getFearGreedIndexDisplayValue(data)

  const getTextColor = () => {
    switch (level.color) {
      case "red":
        return "text-[#FF0066]"
      case "green": 
        return "text-[#8dd324]"
      default:
        return "text-neutral-300"
    }
  }

  return (
    <div className="relative flex justify-between items-baseline w-full h-[15px] gap-[2px]">
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
        <div className="relative flex items-center justify-center w-[29px] h-[15px]">
          {/* Arc */}
          <div className="absolute h-[10px] border-l border-r border-t border-dotted border-white rounded-t-full w-[20px] bg-black"></div>
          
          {/* Needle Arm */}
          <div
            className="absolute w-[1px] h-[6px] bottom-1 bg-white transition-transform duration-1000 rounded-full"
            style={{
              transform: `rotate(${needleRotation}deg)`,
              transformOrigin: "bottom center",
            }}
          />

          {/* Needle Dot */}
          <div className="absolute bottom-[3px] w-0.5 h-0.5 bg-white rounded-full" />
        </div>
      </div>
    </div>
  )
}
