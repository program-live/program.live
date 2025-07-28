import { cronJobs } from 'convex/server';
import { internal }  from './_generated/api';

const crons = cronJobs();
crons.interval('refresh-quotes',  { minutes: 15 }, internal.quotes.refresh);
crons.interval('refresh-open-source', { minutes: 15 }, internal.openSource.refresh);
crons.interval('refresh-weather', { minutes: 15 }, internal.weather.refresh);
crons.interval('refresh-news', { minutes: 15 }, internal.news.refresh);
crons.interval('refresh-fear-greed-index', { hours: 1 }, internal.fearGreedIndex.refresh);
export default crons;