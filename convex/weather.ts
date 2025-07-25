import { internalAction, internalMutation, query } from './_generated/server';
import { internal } from './_generated/api';
import { v } from 'convex/values';
import { fetchWithBackoff } from '../lib/utils';

// Open-Meteo API types
interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    weather_code: number[];
  };
  daily_units: {
    temperature_2m_max: string;
    weather_code: string;
  };
}

const TORONTO_COORDINATES = {
  latitude: 43.6532,
  longitude: -79.3832,
};

// Fallback weather data
const fallbackWeatherData = [
  { day: "SUN", temp: 24, condition: "⛅" },
  { day: "MON", temp: 22, condition: "🌤️" },
  { day: "TUE", temp: 26, condition: "☀️" },
  { day: "WED", temp: 23, condition: "🌧️" },
  { day: "THU", temp: 21, condition: "⛈️" },
  { day: "FRI", temp: 25, condition: "🌤️" },
  { day: "SAT", temp: 27, condition: "☀️" },
];

// Map WMO weather codes to emoji conditions
function getWeatherCondition(code: number): string {
  if (code === 0) return "☀️"; // Clear sky
  if (code >= 1 && code <= 3) return "🌤️"; // Mainly clear, partly cloudy, and overcast
  if (code === 45 || code === 48) return "☁️"; // Fog and depositing rime fog
  if (code === 51) return "🌧️"; // Light drizzle - show as cloudy
  if (code === 53 || code === 55) return "🌧️"; // Moderate and dense drizzle
  if (code === 56 || code === 57) return "🌧️"; // Freezing Drizzle: Light and dense intensity
  if (code === 61) return "🌧️"; // Slight rain - show as cloudy
  if (code === 63 || code === 65) return "🌧️"; // Moderate and heavy rain
  if (code === 66 || code === 67) return "🌧️"; // Freezing Rain: Light and heavy intensity
  if (code === 71) return "🌨️"; // Slight snow - show as cloudy
  if (code === 73 || code === 75) return "🌨️"; // Moderate and heavy snow
  if (code === 77) return "🌨️"; // Snow grains
  if (code === 80) return "🌦️"; // Slight rain showers - show as cloudy
  if (code === 81 || code === 82) return "🌦️"; // Moderate and violent rain showers
  if (code === 85 || code === 86) return "🌨️"; // Snow showers slight and heavy
  if (code === 95) return "⛈️"; // Thunderstorm: Slight or moderate
  if (code === 96 || code === 99) return "⛈️"; // Thunderstorm with slight and heavy hail
  
  return "⛅";
}

function getDayAbbreviation(dateString: string): string {
  const date = new Date(dateString + 'T12:00:00');
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return days[date.getDay()];
}

// Internal action that fetches from Open-Meteo API and calls mutation
export const refresh = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    try {
      const weatherDays = await fetchWithBackoff(async () => {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${TORONTO_COORDINATES.latitude}&longitude=${TORONTO_COORDINATES.longitude}&daily=temperature_2m_max,weather_code&timezone=America/Toronto&forecast_days=7`,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: OpenMeteoResponse = await response.json();
        
        // Transform the data to match our schema
        return data.daily.time.map((dateString, index) => {
          const maxTemp = data.daily.temperature_2m_max[index];
          const weatherCode = data.daily.weather_code[index];
          
          // Use maximum temperature for display
          const temp = Math.round(maxTemp);
          
          return {
            day: getDayAbbreviation(dateString),
            temp,
            condition: getWeatherCondition(weatherCode)
          };
        });
      });

      // Call mutation to store weather data
      await ctx.runMutation(internal.weather.storeWeatherData, { 
        days: weatherDays,
        updated: Date.now()
      });
    } catch (error) {
      console.error('Error refreshing weather data:', error);
      // Use fallback data if fetch fails
      await ctx.runMutation(internal.weather.storeWeatherData, { 
        days: fallbackWeatherData,
        updated: Date.now()
      });
    }
    
    return null;
  },
});

// Internal mutation that writes to database
export const storeWeatherData = internalMutation({
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
    const existing = await ctx.db.query('weatherData').collect();
    for (const weather of existing) {
      await ctx.db.delete(weather._id);
    }
    
    // Insert new weather data
    await ctx.db.insert('weatherData', {
      days: args.days,
      updated: args.updated,
    });
    
    return null;
  },
});

// Query to get weather data
export const getWeatherData = query({
  args: {},
  returns: v.union(
    v.object({
      _id: v.id('weatherData'),
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
    const weatherData = await ctx.db.query('weatherData').first();
    return weatherData;
  },
}); 