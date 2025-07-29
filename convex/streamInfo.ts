import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get the current stream info (title and description)
export const getCurrentInfo = query({
  args: {},
  handler: async (ctx) => {
    const info = await ctx.db
      .query("streamInfo")
      .order("desc")
      .first();
    
    return info || { 
      title: undefined,
      description: undefined,
      timestamp: Date.now()
    };
  },
});

// Update stream title and description
export const updateInfo = mutation({
  args: { 
    title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentTime = Date.now();
    
    const newInfo = {
      title: args.title || undefined,
      description: args.description || undefined,
      timestamp: currentTime,
    };
    
    await ctx.db.insert("streamInfo", newInfo);
    return newInfo;
  },
});

// Clear stream title and description (set to empty/undefined)
export const clearInfo = mutation({
  args: {},
  handler: async (ctx) => {
    const currentTime = Date.now();
    
    const clearedInfo = {
      title: undefined,
      description: undefined,
      timestamp: currentTime,
    };
    
    await ctx.db.insert("streamInfo", clearedInfo);
    return clearedInfo;
  },
});