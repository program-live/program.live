import Image from "next/image";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import WarpEffect from "./warp-effect";

// Common WarpEffect props
const WARP_EFFECT_PROPS = {
  maxWidth: 300,
  maxHeight: 120,
  particleCount: 300,
  particleBrightness: 0.8,
  warpBrightness: 1,
  className: "border-r border-b border-dotted "
};

// Fallback sponsor for empty slots (directs to buy spot)
const FALLBACK_SPONSOR = {
  _id: "fallback",
  name: "Buy Spot",
  linkUrl: "https://app.market.dev/checkout/cmdg4lrpa0001l10acbshoc4k",
  displayText: "BUY SPOT",
  paddingClass: "px-[30px]",
  isActive: true,
  displayOrder: 999,
  createdAt: 0,
  updatedAt: 0
};

export default function Sponsors() {
  const sponsors = useQuery(api.sponsors.getActiveSponsors);

  // Show loading state
  if (sponsors === undefined) {
    return (
      <div className="h-full flex items-end">
        <div className="relative grid grid-cols-2 md:grid-cols-4 h-full min-h-[120px] md:min-h-[90px] max-h-[120px] xl:max-h-none border-l border-t border-dotted w-full">
          <h2 aria-hidden className="absolute text-center -top-[5px] -left-[3px] bg-black z-[1px] px-0.5">SP0NSORS</h2>
          <span className="sr-only">Sponsors</span>
          {/* Loading placeholders */}
          {Array.from({ length: 4 }).map((_, index) => (
            <WarpEffect key={index} {...WARP_EFFECT_PROPS}>
              <div className="flex items-center justify-center px-[30px] w-full h-full">
                <span className="opacity-50">Loading...</span>
              </div>
            </WarpEffect>
          ))}
        </div>
      </div>
    );
  }

  // Fill empty spots with fallback sponsors to always show 4 slots
  const displaySponsors = [...sponsors];
  while (displaySponsors.length < 4) {
    displaySponsors.push({ ...FALLBACK_SPONSOR, _id: `fallback-${displaySponsors.length}` });
  }

  // Only show first 4 sponsors
  const sponsorsToShow = displaySponsors.slice(0, 4);

  return (
    <div className="h-full flex items-end">
      <div className="relative grid grid-cols-2 md:grid-cols-4 h-full min-h-[120px] md:min-h-[90px] max-h-[120px] xl:max-h-none border-l border-t border-dotted w-full">
        <h2 aria-hidden className="absolute text-center -top-[5px] -left-[3px] bg-black z-[1px] px-0.5">SP0NSORS</h2>
        <span className="sr-only">Sponsors</span>
        
        {sponsorsToShow.map((sponsor, index) => (
          <WarpEffect key={sponsor._id} {...WARP_EFFECT_PROPS}>
            <Link 
              href={sponsor.linkUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`group flex items-center justify-center ${sponsor.paddingClass || 'px-[30px]'} w-full h-full`}
            >
              {sponsor.logoUrl ? (
                <Image 
                  src={sponsor.logoUrl} 
                  alt={sponsor.name} 
                  width={120} 
                  height={60} 
                  className="max-h-[20px] md:max-h-[25px] w-auto h-full cursor-pointer group-hover:opacity-70" 
                  priority={index === 0} // Only prioritize first image
                />
              ) : (
                <span className="group-hover:opacity-70" aria-hidden>
                  {sponsor.displayText || sponsor.name}
                </span>
              )}
              <span className="sr-only">{sponsor.name}</span>
            </Link>
          </WarpEffect>
        ))}
      </div>
    </div>
  );
} 