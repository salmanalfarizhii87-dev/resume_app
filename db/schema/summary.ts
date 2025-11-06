import { pgTable, text, timestamp, serial, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth";

// --- Enums ---

export const summarySourceEnum = pgEnum("summary_source_type", [
  "text",
  "url",
  "youtube",
]);

export const summaryStyleEnum = pgEnum("summary_style_type", [
  "bullet_points",
  "short_paragraph",
  "explain_like_five",
]);

// --- Summaries Table ---

export const summary = pgTable("summary", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  
  sourceType: summarySourceEnum("source_type").notNull(),
  summaryStyle: summaryStyleEnum("summary_style").notNull(),

  originalSource: text("original_source"), // The URL or a snippet of the original text
  
  // The full text that was sent to the API (after parsing)
  // May be large, but good for historical reference.
  processedText: text("processed_text"),
  
  // The final summary result from Gemini
  summaryText: text("summary_text").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Relations ---

export const summaryRelations = relations(summary, ({ one }) => ({
  user: one(user, {
    fields: [summary.userId],
    references: [user.id],
  }),
}));
