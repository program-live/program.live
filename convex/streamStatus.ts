import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get the current stream status
export const getCurrentStatus = query({
  args: {},
  handler: async (ctx) => {
    const status = await ctx.db
      .query("streamStatus")
      .order("desc")
      .first();
    
    return status || { 
      isLive: false, 
      timestamp: Date.now(),
      startedAt: undefined 
    };
  },
});

// Get stream status history
export const getStatusHistory = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("streamStatus")
      .order("desc")
      .take(10); // Last 10 status changes
  },
});

// Update stream status (go live or offline)
export const updateStatus = mutation({
  args: { 
    isLive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const currentTime = Date.now();
    
    // Get the current status to check if there's a change
    const currentStatus = await ctx.db
      .query("streamStatus")
      .order("desc")
      .first();
    
    // Only create a new entry if the status actually changed
    if (!currentStatus || currentStatus.isLive !== args.isLive) {
      const newStatus = {
        isLive: args.isLive,
        timestamp: currentTime,
        startedAt: args.isLive ? currentTime : undefined,
      };
      
      await ctx.db.insert("streamStatus", newStatus);
      return newStatus;
    }
    
    return currentStatus;
  },
}); 