import { cn } from "@/lib/utils";

interface TimeDisplayProps {
  mounted: boolean;
  time: Date;
  className?: string;
}

export default function TimeDisplay({ mounted, time, className }: TimeDisplayProps) {
  return (
    <span className={cn("text-10 leading-15", className)}>
      {mounted 
        ? time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }) 
        : "12:00:00 AM"
      }
    </span>
  );
}
