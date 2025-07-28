import { internalAction, internalMutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { getQuotes } from '../lib/markets/finnhub';
import { v } from 'convex/values';

// Internal action that fetches from API and calls mutation
export const refresh = internalAction({
  args: {},
  handler: async (ctx) => {
    try {
      const quotes = await getQuotes();
      await ctx.runMutation(internal.quotes.storeQuotes, { quotes });
    } catch (error) {
      console.error('Error refreshing quotes:', error);
    }
  },
});

// Internal mutation that writes to database
export const storeQuotes = internalMutation({
  args: {
    quotes: v.array(v.object({
      symbol: v.string(),
      price: v.number(),
      changePct: v.number(),
      updated: v.number(),
      kind: v.union(v.literal('stock'), v.literal('crypto')),
      isHighlight: v.boolean(),
    }))
  },
  handler: async (ctx, args) => {
    // Clear old quotes for these symbols
    for (const quote of args.quotes) {
      const existing = await ctx.db
        .query('quotes')
        .withIndex('by_symbol', q => q.eq('symbol', quote.symbol))
        .unique();
      
      if (existing) {
        await ctx.db.delete(existing._id);
      }
    }
    
    // Insert new quotes
    for (const quote of args.quotes) {
      await ctx.db.insert('quotes', quote);
    }
  },
});

// Query to get highlights (featured individually)
export const getHighlights = query({
  args: { kind: v.union(v.literal('stock'), v.literal('crypto')) },
  handler: async (ctx, { kind }) => {
    return await ctx.db
      .query('quotes')
      .withIndex('by_kind_and_highlight', q => q.eq('kind', kind).eq('isHighlight', true))
      .collect();
  },
});

// Query to get ticker tape items (scrolling)
export const getTickerTape = query({
  args: { kind: v.union(v.literal('stock'), v.literal('crypto')) },
  handler: async (ctx, { kind }) => {
    return await ctx.db
      .query('quotes')
      .withIndex('by_kind_and_highlight', q => q.eq('kind', kind).eq('isHighlight', false))
      .collect();
  },
});

