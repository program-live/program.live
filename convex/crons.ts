import { cronJobs } from 'convex/server';
import { internal }  from './_generated/api';

const crons = cronJobs();
crons.interval('refresh-quotes',  { minutes: 10 }, internal.quotes.refresh);
crons.interval('refresh-open-source', { minutes: 15 }, internal.openSource.refresh);
crons.interval('refresh-weather', { minutes: 10 }, internal.weather.refresh);
export default crons;