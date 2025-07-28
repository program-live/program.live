import { internalAction, internalMutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { getOpenSourceProjects } from '../lib/github-repo-search';

// Internal action that fetches from GitHub API and calls mutation
export const refresh = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    try {
      const projects = await getOpenSourceProjects(50);
      await ctx.runMutation(internal.openSource.storeProjects, { projects });
    } catch (error) {
      console.error('Error refreshing open source projects:', error);
    }
    
    return null;
  },
});

// Internal mutation that writes to database
export const storeProjects = internalMutation({
  args: {
    projects: v.array(v.object({
      title: v.string(),
      stars: v.string(),
      starCount: v.number(),
      url: v.string(),
      updated: v.number(),
    }))
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Clear all existing projects
    const existing = await ctx.db.query('openSource').collect();
    for (const project of existing) {
      await ctx.db.delete(project._id);
    }
    
    // Insert new projects
    for (const project of args.projects) {
      await ctx.db.insert('openSource', project);
    }
    
    return null;
  },
});

// Query to get open source projects
export const getProjects = query({
  args: { 
    limit: v.optional(v.number())
  },
  returns: v.array(v.object({
    _id: v.id('openSource'),
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
      .query('openSource')
      .withIndex('by_star_count')
      .order('desc') // Highest star count first
      .take(limit);
  },
}); 