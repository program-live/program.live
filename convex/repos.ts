import { internalAction, internalMutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { getOpenSourceRepos } from '../lib/github-repo-search';

// Internal action that fetches from GitHub API and calls mutation
export const refresh = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    try {
      const repos = await getOpenSourceRepos(50);
      await ctx.runMutation(internal.repos.storeRepos, { repos });
    } catch (error) {
      console.error('Error refreshing open source repos:', error);
    }
    
    return null;
  },
});

// Internal mutation that writes to database
export const storeRepos = internalMutation({
  args: {
    repos: v.array(v.object({
      title: v.string(),
      stars: v.string(),
      starCount: v.number(),
      url: v.string(),
      updated: v.number(),
    }))
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Clear all existing repos
    const existing = await ctx.db.query('repos').collect();
    for (const repo of existing) {
      await ctx.db.delete(repo._id);
    }
    
    // Insert new repos
    for (const repo of args.repos) {
      await ctx.db.insert('repos', repo);
    }
    
    return null;
  },
});

// Query to get open source repos
export const getRepos = query({
  args: { 
    limit: v.optional(v.number())
  },
  returns: v.array(v.object({
    _id: v.id('repos'),
    _creationTime: v.number(),
    title: v.string(),
    stars: v.string(),
    starCount: v.number(),
    url: v.string(),
    updated: v.number(),
  })),
  handler: async (ctx, args) => {
    const limit = args.limit ?? 40;
    
    return await ctx.db
      .query('repos')
      .withIndex('by_star_count')
      .order('desc') // Highest star count first
      .take(limit);
  },
}); 