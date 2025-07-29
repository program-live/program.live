import Link from "next/link";
import ScrollingText from "../scrolling-text";
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

export default async function SponsorBanner() {
  const bannerSponsors = await fetchQuery(api.sponsors.getActiveSponsorsByPlacement, { placement: "banner" });

  const bannerSponsor = bannerSponsors?.[0];
  const displayText = bannerSponsor?.displayText || bannerSponsor?.name || "SPONSOR THIS SPOT";
  const linkUrl = bannerSponsor?.linkUrl || "https://app.market.dev/checkout/cmdg4lrpa0001l10acbshoc4k";
  
  return (
    <Link 
      href={linkUrl} 
      target="_blank" 
      className="relative h-15 shrink-0 col-span-full font-extrabold hover:bg-primary hover:text-primary-foreground"
    >
      <ScrollingText 
        direction="right" 
        speed={1000} 
        className="h-full items-center" 
        aria-hidden
      >
        {[...Array(50)].map((_, i) => (
          <span key={i}>
            {displayText} <span className="align-[1px]">◉</span>{'\u00A0'}
          </span>
        ))}
      </ScrollingText>
      <span className="sr-only">{displayText}</span>
    </Link>
  );
} 