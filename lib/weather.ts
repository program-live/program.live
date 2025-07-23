import { unstable_cache } from 'next/cache';

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

export interface WeatherDay {
  day: string;
  temp: number;
  condition: string;
}

const TORONTO_COORDINATES = {
  latitude: 43.6532,
  longitude: -79.3832,
};

// Fallback weather data (same as current placeholder)
const fallbackWeatherData: WeatherDay[] = [
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

// Fetch weather data from Open-Meteo
async function fetchSevenDayForecastData(): Promise<WeatherDay[]> {
  try {
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
    
    // Transform the data to match our WeatherDay interface
    const sevenDayForecast: WeatherDay[] = data.daily.time.map((dateString, index) => {
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
    
    return sevenDayForecast;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return fallbackWeatherData;
  }
}

export const getWeatherData = unstable_cache(
  fetchSevenDayForecastData,
  ['weather-data'],
  {
    revalidate: 900, // 15 minutes in seconds
    tags: ['weather']
  }
); 