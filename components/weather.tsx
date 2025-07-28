import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';

export default async function Weather() {
  const weather = await fetchQuery(api.weather.getWeather);
  
  const days = weather?.days || [];

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