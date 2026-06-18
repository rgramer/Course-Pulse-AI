import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const courseContextTable = pgTable("course_context", {
  id: serial("id").primaryKey(),
  week: integer("week").notNull(),
  topic: text("topic").notNull(),
  learningObjective: text("learning_objective").notNull(),
  assignment: text("assignment"),
  reading: text("reading"),
});

export const insertCourseContextSchema = createInsertSchema(courseContextTable).omit({ id: true });
export type InsertCourseContext = z.infer<typeof insertCourseContextSchema>;
export type CourseContext = typeof courseContextTable.$inferSelect;
