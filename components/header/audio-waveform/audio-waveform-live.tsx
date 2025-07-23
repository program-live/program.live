"use client";

import { useEffect, useState } from "react";

interface AudioWaveformOnlineProps {
  className?: string;
}

export default function AudioWaveformOnline({ className }: AudioWaveformOnlineProps) {
  const [waveformHeights, setWaveformHeights] = useState<number[]>(new Array(5).fill(50));
  const [waveformTime, setWaveformTime] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize with diamond-shaped pattern
    setWaveformHeights(Array(5).fill(0).map((_, i) => {
      const diamondBias = i === 2 ? 1.4 : i === 1 || i === 3 ? 0.9 : 0.4;
      return (20 + Math.random() * 50) * diamondBias;
    }));

    const timer = setInterval(() => {
      // Generate smoother speech-like patterns with diamond bias
      setWaveformHeights(prevHeights => 
        prevHeights.map((prevHeight, i) => {
          // Create diamond bias - center bars (index 2) are tallest, edges (0,4) shortest
          const diamondBias = i === 2 ? 1.4 : i === 1 || i === 3 ? 0.9 : 0.4; // Center: 140%, Mid: 90%, Edges: 40%
          
          // Smoother target height with less randomness
          const targetBase = 25 + Math.random() * 35;
          const targetHeight = targetBase * diamondBias;
          
          // Smoothly interpolate towards target (less jumpy)
          const smoothingFactor = 0.3; // Lower = smoother transitions
          const newHeight = prevHeight + (targetHeight - prevHeight) * smoothingFactor;
          
          return Math.min(90, Math.max(5, newHeight));
        })
      );
    }, 150); // Slower, more relaxed animation

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={`flex items-center gap-2 h-10 ${className}`}>
      {waveformHeights.map((height, i) => (
        <div
          key={i}
          className="w-1 bg-primary transition-all duration-100 ease-out"
          style={{
            height: mounted ? `${height}%` : '50%',
          }}
        />
      ))}
    </div>
  );
}