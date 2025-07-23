import { getWeatherData } from "@/lib/weather";

export default async function Weather() {
  const weatherData = await getWeatherData();

  return (
    <div className="flex justify-between">
      {weatherData.map((day, i) => (
        <div key={i} className="text-center -ml-1">
          <div>{day.day}</div>
          <div>{day.condition}</div>
          <div className="pl-4">{day.temp}°</div>
        </div>
      ))}
    </div>
  );
} 