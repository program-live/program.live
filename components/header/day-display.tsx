import { cn } from "@/lib/utils";

interface DayDisplayProps {
  mounted: boolean;
  time: Date;
  className?: string;
}

export default function DayDisplay({ mounted, time, className }: DayDisplayProps) {
  return (
    <span className={cn("text-10 leading-15", className)}>
      {mounted 
        ? time.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: '2-digit', year: 'numeric'}).replace(/,/g, '')
        : "MON JAN 01 2025"
      }
    </span>
  );
}
