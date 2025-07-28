import { internalAction, internalMutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { getHackerNewsStories } from '../lib/hacker-news';

// Internal action that fetches from Hacker News API and calls mutation
export const refresh = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    try {
      const stories = await getHackerNewsStories(60);
      await ctx.runMutation(internal.news.storeStories, { stories });
    } catch (error) {
      console.error('Error refreshing news stories:', error);
    }
    
    return null;
  },
});

// Internal mutation that writes to database
export const storeStories = internalMutation({
  args: {
    stories: v.array(v.object({
      title: v.string(),
      url: v.string(),
      date: v.string(),
    }))
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const cache = await ctx.db.query('news').first();
    
    if (cache) {
      await ctx.db.patch(cache._id, {
        stories: args.stories,
        updated: Date.now(),
      });
    } else {
      await ctx.db.insert('news', {
        stories: args.stories,
        updated: Date.now(),
      });
    }
    
    return null;
  },
});

// Query to get news stories
export const getStories = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('news').first();
  },
}); 