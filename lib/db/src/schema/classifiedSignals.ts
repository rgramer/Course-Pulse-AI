import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { reflectionsTable } from "./reflections";

export const classifiedSignalsTable = pgTable("classified_signals", {
  id: serial("id").primaryKey(),
  reflectionId: integer("reflection_id").notNull().references(() => reflectionsTable.id),
  primarySignal: text("primary_signal").notNull(),
  secondarySignal: text("secondary_signal"),
  severityScore: integer("severity_score").notNull().default(0),
  themeSummary: text("theme_summary").notNull(),
  recommendedAction: text("recommended_action").notNull(),
});

export const insertClassifiedSignalSchema = createInsertSchema(classifiedSignalsTable).omit({ id: true });
export type InsertClassifiedSignal = z.infer<typeof insertClassifiedSignalSchema>;
export type ClassifiedSignal = typeof classifiedSignalsTable.$inferSelect;
