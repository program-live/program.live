import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  quotes: defineTable({
    symbol: v.string(),
    price: v.number(),
    changePct: v.number(),
    updated: v.number(),
    kind: v.union(v.literal('stock'), v.literal('crypto')),
    isHighlight: v.boolean(), // true = featured individually, false = ticker tape
  }).index("by_symbol", ["symbol"])
    .index("by_kind", ["kind"])
    .index("by_kind_and_highlight", ["kind", "isHighlight"]),

  streamStatus: defineTable({
    isLive: v.boolean(),
    timestamp: v.number(), // Unix timestamp when status changed
    startedAt: v.optional(v.number()), // When stream started (if currently live)
  }),
  
  streamInfo: defineTable({
    title: v.optional(v.string()), // Stream title (can be empty/null for placeholder)
    description: v.optional(v.string()), // Stream description (can be empty/null for placeholder)
    timestamp: v.number(), // When this info was set/updated
  }),
  
  sponsors: defineTable({
    name: v.string(),
    logoUrl: v.optional(v.string()), // URL to sponsor logo
    linkUrl: v.string(), // URL sponsor links to
    displayText: v.optional(v.string()), // Text to display if no logo
    displayOrder: v.number(), // Order to display sponsors
    isActive: v.boolean(), // Whether sponsor should be shown
    paddingClass: v.optional(v.string()), // Custom padding class
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_display_order", ["displayOrder"])
    .index("by_active", ["isActive"]),

  openSource: defineTable({
    title: v.string(),
    stars: v.string(), // Formatted star count (e.g., "1.2k", "5.4M")
    starCount: v.number(), // Raw star count for sorting
    url: v.string(),
    updated: v.number(), // When this data was fetched
  }).index("by_star_count", ["starCount"])
    .index("by_updated", ["updated"]),

  weatherData: defineTable({
    days: v.array(v.object({
      day: v.string(), // Day abbreviation: "MON", "TUE", etc.
      temp: v.number(), // Temperature in celsius
      condition: v.string(), // Weather emoji: "☀️", "🌧️", etc.
    })),
    updated: v.number(), // Timestamp of last update
  }),

  news: defineTable({
    stories: v.array(v.object({
      title: v.string(),
      url: v.string(),
      date: v.string(), // Formatted date like "Nov 15"
    })),
    updated: v.number(), // Timestamp of last update
  }),
}); 