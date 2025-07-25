import { internalAction, internalMutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { fetchWithBackoff } from '../lib/utils';

interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  created_at: string;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

// One project had this word in the name, so we're banning it
const BANNED_WORDS = ['SHIT'];

function containsBannedWords(text: string): boolean {
  const upperText = text.toUpperCase();
  return BANNED_WORDS.some(bannedWord => upperText.includes(bannedWord));
}

export function formatStarCount(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`;
  }
  return stars.toString();
}

// Internal action that fetches from GitHub API and calls mutation
export const refresh = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    try {
      const projects = await fetchWithBackoff(async () => {
        const date = new Date();
        date.setDate(date.getDate() - 45);
        const dateString = date.toISOString().split('T')[0];

        const query = `created:>${dateString} stars:500..5000 archived:false is:public`;
        const params = new URLSearchParams({
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: '100',
        });

        const response = await fetch(`https://api.github.com/search/repositories?${params}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'program-live-app',
          },
        });

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const data: GitHubSearchResponse = await response.json();

        return data.items
          .filter(repo => !containsBannedWords(repo.name))
          .slice(0, 50) // Get more than we need for mobile/desktop flexibility
          .map(repo => ({
            title: repo.name,
            stars: formatStarCount(repo.stargazers_count),
            starCount: repo.stargazers_count,
            url: repo.html_url,
            updated: Date.now(),
          }));
      });

      // Call mutation to store all projects
      await ctx.runMutation(internal.openSource.storeProjects, { projects });
    } catch (error) {
      console.error('Error refreshing open source projects:', error);
      // Don't throw - we want the cron to continue running even if one refresh fails
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
    const existing = await ctx.db.query('openSourceProjects').collect();
    for (const project of existing) {
      await ctx.db.delete(project._id);
    }
    
    // Insert new projects
    for (const project of args.projects) {
      await ctx.db.insert('openSourceProjects', project);
    }
    
    return null;
  },
});

// Query to get open source projects
export const getProjects = query({
  args: { 
    limit: v.optional(v.number()),
    isMobile: v.optional(v.boolean())
  },
  returns: v.array(v.object({
    _id: v.id('openSourceProjects'),
    _creationTime: v.number(),
    title: v.string(),
    stars: v.string(),
    starCount: v.number(),
    url: v.string(),
    updated: v.number(),
  })),
  handler: async (ctx, args) => {
    const limit = args.limit || 40;
    const isMobile = args.isMobile || false;
    const adjustedLimit = isMobile ? Math.floor(limit * 0.67) : limit;
    
    return await ctx.db
      .query('openSourceProjects')
      .withIndex('by_star_count')
      .order('desc') // Highest star count first
      .take(adjustedLimit);
  },
}); 