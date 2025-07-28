import { internalAction, internalMutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { getWeatherForecast, fallbackWeather } from '../lib/open-meteo';

// Internal action that fetches from Open-Meteo API and calls mutation
export const refresh = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    try {
      const weatherDays = await getWeatherForecast();
      await ctx.runMutation(internal.weather.storeWeather, { 
        days: weatherDays,
        updated: Date.now()
      });
    } catch (error) {
      console.error('Error refreshing weather data:', error);
      // Use fallback data if fetch fails
      await ctx.runMutation(internal.weather.storeWeather, { 
        days: fallbackWeather,
        updated: Date.now()
      });
    }
    
    return null;
  },
});

// Internal mutation that writes to database
export const storeWeather = internalMutation({
  args: {
    days: v.array(v.object({
      day: v.string(),
      temp: v.number(),
      condition: v.string(),
    })),
    updated: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Clear existing weather data (should only be one document)
    const existing = await ctx.db.query('weather').collect();
    for (const weather of existing) {
      await ctx.db.delete(weather._id);
    }
    
    // Insert new weather data
    await ctx.db.insert('weather', {
      days: args.days,
      updated: args.updated,
    });
    
    return null;
  },
});

// Query to get weather data
export const getWeather = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id('weather'),
      _creationTime: v.number(),
      days: v.array(v.object({
        day: v.string(),
        temp: v.number(),
        condition: v.string(),
      })),
      updated: v.number(),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const weatherData = await ctx.db.query('weather').first();
    return weatherData;
  },
}); 