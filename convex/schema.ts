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
}); 