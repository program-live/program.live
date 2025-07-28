import { cronJobs } from 'convex/server';
import { internal }  from './_generated/api';

const crons = cronJobs();
crons.interval('refresh-quotes',  { minutes: 15 }, internal.quotes.refresh);
crons.interval('refresh-repos', { minutes: 15 }, internal.repos.refresh);
crons.interval('refresh-weather', { minutes: 15 }, internal.weather.refresh);
crons.interval('refresh-news', { minutes: 15 }, internal.news.refresh);
export default crons;