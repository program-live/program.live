import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all active sponsors ordered by displayOrder for frontend display
export const getActiveSponsors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sponsors")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .order("asc")
      .collect();
  },
});

// Get active sponsors by placement
export const getActiveSponsorsByPlacement = query({
  args: {
    placement: v.union(v.literal("card"), v.literal("banner")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("sponsors")
      .withIndex("by_active_placement", (q) => 
        q.eq("isActive", true).eq("placement", args.placement)
      )
      .order("asc")
      .collect();
  },
});

// Get all sponsors for admin management
export const getAllSponsors = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("sponsors")
      .withIndex("by_display_order")
      .order("asc")
      .collect();
  },
});

// Create a new sponsor
export const createSponsor = mutation({
  args: {
    placement: v.union(v.literal("card"), v.literal("banner")),
    name: v.string(),
    logoUrl: v.optional(v.string()),
    linkUrl: v.string(),
    displayText: v.optional(v.string()),
    displayOrder: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    return await ctx.db.insert("sponsors", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update an existing sponsor
export const updateSponsor = mutation({
  args: {
    id: v.id("sponsors"),
    placement: v.optional(v.union(v.literal("card"), v.literal("banner"))),
    name: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    displayText: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    if (Object.keys(cleanUpdates).length === 0) {
      throw new Error("No updates provided");
    }
    
    return await ctx.db.patch(id, {
      ...cleanUpdates,
      updatedAt: Date.now(),
    });
  },
});

// Delete a sponsor
export const deleteSponsor = mutation({
  args: {
    id: v.id("sponsors"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});

// Toggle sponsor active status
export const toggleSponsorStatus = mutation({
  args: {
    id: v.id("sponsors"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.id, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });
  },
});

// Migration: Backfill existing sponsors with placement='card'
export const backfillSponsorPlacements = mutation({
  args: {},
  handler: async (ctx) => {
    // Get all sponsors without placement field
    const allSponsors = await ctx.db.query("sponsors").collect();
    
    let updatedCount = 0;
    for (const sponsor of allSponsors) {
      // Cast to any to check for undefined placement on legacy documents
      const legacySponsor = sponsor as any;
      if (legacySponsor.placement === undefined) {
        await ctx.db.patch(legacySponsor._id, {
          placement: "card",
          displayText: legacySponsor.displayText || legacySponsor.name,
          updatedAt: Date.now(),
        });
        updatedCount++;
      }
    }
    
    return {
      message: `Updated ${updatedCount} sponsors with placement='card'`,
      totalSponsors: allSponsors.length,
      updatedCount,
    };
  },
});