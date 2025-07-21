"use client";

import { ReactNode } from 'react';

interface ScrollingTextProps {
  children: ReactNode;
  direction?: 'left' | 'right';
  speed?: number; // animation duration in seconds
  className?: string;
}

export default function ScrollingText({ 
  children, 
  direction = 'right', 
  speed = 100, 
  className = ''
}: ScrollingTextProps) {
  // Create the animation classes based on direction
  const animationClass = direction === 'left' ? 'scroll-left' : 'scroll-right';
  
  return (
    <div className={`flex overflow-hidden select-none ${className}`}>
      <div 
        className={`flex-shrink-0 flex justify-around min-w-full ${animationClass}`}
        style={{ animationDuration: `${speed}s` }}
      >
        {children}
      </div>
      {/* Duplicate content for seamless loop */}
      <div 
        className={`flex-shrink-0 flex justify-around min-w-full ${animationClass}`}
        style={{ animationDuration: `${speed}s` }}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  );
} 