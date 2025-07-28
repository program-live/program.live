import { mutation } from "../_generated/server";

// Sample data migration - run this once to populate sponsors
export const populateSampleSponsors = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if sponsors already exist
    const existingSponsors = await ctx.db.query("sponsors").collect();
    if (existingSponsors.length > 0) {
      return { message: "Sponsors already exist, skipping population" };
    }

    const now = Date.now();
    
    // Sample sponsors
    const sampleSponsors = [
      {
        name: "market.dev",
        logoUrl: "/market-dot-dev-logo-white.svg",
        linkUrl: "https://app.market.dev/checkout/cmdg4lrpa0001l10acbshoc4k",
        displayOrder: 1,
        isActive: true,
        paddingClass: "px-[15px] sm:px-[30px]",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Available Spot",
        linkUrl: "https://app.market.dev/checkout/cmdg4lrpa0001l10acbshoc4k",
        displayText: "BUY SPOT",
        displayOrder: 2,
        isActive: true,
        paddingClass: "px-[30px]",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Available Spot",
        linkUrl: "https://app.market.dev/checkout/cmdg4lrpa0001l10acbshoc4k",
        displayText: "BUY SPOT",
        displayOrder: 3,
        isActive: true,
        paddingClass: "px-[30px]",
        createdAt: now,
        updatedAt: now,
      },
      {
        name: "Available Spot",
        linkUrl: "https://app.market.dev/checkout/cmdg4lrpa0001l10acbshoc4k",
        displayText: "BUY SPOT",
        displayOrder: 4,
        isActive: true,
        paddingClass: "px-[30px]",
        createdAt: now,
        updatedAt: now,
      }
    ];

    // Insert all sponsors
    const results = [];
    for (const sponsor of sampleSponsors) {
      const id = await ctx.db.insert("sponsors", sponsor);
      results.push(id);
    }

    return { 
      message: `Successfully created ${results.length} sample sponsors`,
      sponsorIds: results 
    };
  },
}); 