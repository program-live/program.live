import LiveStatus from "@/components/header/live-status";
import AudioWaveform from "@/components/header/audio-waveform/index";
import Logo from "@/components/header/logo";
import StreamDuration from "@/components/header/stream-duration";
import DateDisplay from "@/components/header/date-display";
import TimeDisplay from "@/components/header/time-display";
import { cn } from "@/lib/utils";

export default function Header({ className }: { className?: string }) {
  return (
    <header className={cn(
      "fixed xl:sticky top-0 left-0 right-0 z-50 bg-background w-full", 
      className
    )}>
      <div className="relative grid grid-cols-12 gap-x-15">
        <DateDisplay className="col-span-4" />
        <Logo className="col-span-4" />
        <TimeDisplay className="col-span-4 justify-self-end" />
        <div className="col-span-full relative flex items-center justify-between gap-15">
          <LiveStatus />
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center h-15">
            <AudioWaveform />
          </div>
          <StreamDuration />
        </div>
      </div>
    </header>
  );
} 