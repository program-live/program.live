import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
}); 