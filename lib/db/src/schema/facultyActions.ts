import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const facultyActionsTable = pgTable("faculty_actions", {
  id: serial("id").primaryKey(),
  week: integer("week").notNull(),
  topic: text("topic").notNull(),
  actionTaken: text("action_taken").notNull(),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFacultyActionSchema = createInsertSchema(facultyActionsTable).omit({ id: true, createdAt: true });
export type InsertFacultyAction = z.infer<typeof insertFacultyActionSchema>;
export type FacultyAction = typeof facultyActionsTable.$inferSelect;
