import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export default async function Weather() {
  const weatherData = await fetchQuery(api.weather.getWeatherData);
  
  const days = weatherData?.days || [];

  return (
    <div className="flex justify-between">
      {days.map((day, i) => (
        <div key={i} className="text-center -ml-1">
          <div>{day.day}</div>
          <div>{day.condition}</div>
          <div className="pl-4">{day.temp}°</div>
        </div>
      ))}
    </div>
  );
} 