/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as crons from "../crons.js";
import type * as fearGreedIndex from "../fearGreedIndex.js";
import type * as news from "../news.js";
import type * as openSource from "../openSource.js";
import type * as quotes from "../quotes.js";
import type * as samples_sampleSponsors from "../samples/sampleSponsors.js";
import type * as sponsors from "../sponsors.js";
import type * as streamInfo from "../streamInfo.js";
import type * as streamStatus from "../streamStatus.js";
import type * as weather from "../weather.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  crons: typeof crons;
  fearGreedIndex: typeof fearGreedIndex;
  news: typeof news;
  openSource: typeof openSource;
  quotes: typeof quotes;
  "samples/sampleSponsors": typeof samples_sampleSponsors;
  sponsors: typeof sponsors;
  streamInfo: typeof streamInfo;
  streamStatus: typeof streamStatus;
  weather: typeof weather;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
