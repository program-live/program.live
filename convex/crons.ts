import { cronJobs } from 'convex/server';
import { internal }  from './_generated/api';

const crons = cronJobs();
crons.interval('refresh-quotes',  { minutes: 10 }, internal.quotes.refresh);
export default crons;