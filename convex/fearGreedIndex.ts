import { internalAction, internalMutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { getFearGreedIndex, fallbackFearGreedData } from '../lib/markets/fear-greed-index';

// Internal action that fetches from Fear & Greed API and calls mutation
export const refresh = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    try {
      const fearGreedData = await getFearGreedIndex();
      await ctx.runMutation(internal.fearGreedIndex.storeFearGreedData, { 
        ...fearGreedData,
        updated: Date.now()
      });
    } catch (error) {
      console.error('Error refreshing fear and greed data:', error);
      // Use fallback data if fetch fails
      await ctx.runMutation(internal.fearGreedIndex.storeFearGreedData, { 
        ...fallbackFearGreedData,
        updated: Date.now()
      });
    }
    
    return null;
  },
});

// Internal mutation that writes to database
export const storeFearGreedData = internalMutation({
  args: {
    value: v.string(),
    value_classification: v.string(),
    timestamp: v.string(),
    time_until_update: v.optional(v.string()),
    updated: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Clear existing fear and greed data (should only be one document)
    const existing = await ctx.db.query('fearGreedIndex').collect();
    for (const fearGreed of existing) {
      await ctx.db.delete(fearGreed._id);
    }
    
    // Insert new fear and greed data
    await ctx.db.insert('fearGreedIndex', {
      value: args.value,
      value_classification: args.value_classification,
      timestamp: args.timestamp,
      time_until_update: args.time_until_update,
      updated: args.updated,
    });
    
    return null;
  },
});

// Query to get fear and greed data
export const getFearGreedData = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id('fearGreedIndex'),
      _creationTime: v.number(),
      value: v.string(),
      value_classification: v.string(),
      timestamp: v.string(),
      time_until_update: v.optional(v.string()),
      updated: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const fearGreedData = await ctx.db.query('fearGreedIndex').first();
    return fearGreedData;
  },
}); 