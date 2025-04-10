import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  avatarUrl: text("avatar_url"),
  role: text("role").default("student").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  htmlLevel: integer("html_level").default(1).notNull(),
  cssLevel: integer("css_level").default(1).notNull(),
  jsLevel: integer("js_level").default(1).notNull(),
  totalPoints: integer("total_points").default(0).notNull(),
});

// Programming languages (HTML, CSS, JavaScript)
export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // html, css, javascript
  displayName: text("display_name").notNull(), // HTML, CSS, JavaScript
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  color: text("color").notNull(), // Brand color for this language
});

// Learning modules (grouped by language and difficulty level)
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  languageId: integer("language_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level").notNull(), // easy, medium, hard
  levelNumber: integer("level_number").notNull(), // 1, 2, 3, etc
  thumbnailUrl: text("thumbnail_url"),
  sortOrder: integer("sort_order").notNull(),
  pointsToEarn: integer("points_to_earn").default(10).notNull(), // Points earned for completing this module
});

// Lessons contained within modules
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(), // HTML content with explanations
  codeExample: text("code_example"), // Example code to show
  previewHtml: text("preview_html"), // HTML to display in preview pane (for HTML lessons)
  sortOrder: integer("sort_order").notNull(),
});

// Challenges/exercises for each lesson
export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  initialCode: text("initial_code"), // Starting code for the challenge
  expectedOutput: text("expected_output"), // Expected result/output
  hints: text("hints").array(), // Array of hints
  sortOrder: integer("sort_order").notNull(),
  points: integer("points").default(5).notNull(), // Points earned for completing this challenge
});

// User progress tracking
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").notNull(),
  lessonId: integer("lesson_id"),
  challengeId: integer("challenge_id"),
  completed: boolean("completed").default(false).notNull(),
  code: text("code"), // User's code solution for the challenge
  pointsEarned: integer("points_earned").default(0).notNull(),
  lastAccessed: timestamp("last_accessed").defaultNow().notNull(),
});

// User badges/achievements
export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  category: text("category").notNull(), // html, css, javascript, general
  requiredPoints: integer("required_points").notNull(),
  level: text("level").notNull(), // beginner, intermediate, advanced
});

// User earned badges
export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  badgeId: integer("badge_id").notNull(),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true,
  htmlLevel: true,
  cssLevel: true,
  jsLevel: true,
  totalPoints: true
});

export const insertLanguageSchema = createInsertSchema(languages).omit({ 
  id: true
});

export const insertModuleSchema = createInsertSchema(modules).omit({ 
  id: true
});

export const insertLessonSchema = createInsertSchema(lessons).omit({ 
  id: true
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({ 
  id: true
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ 
  id: true, 
  lastAccessed: true 
});

export const insertBadgeSchema = createInsertSchema(badges).omit({ 
  id: true
});

export const insertUserBadgeSchema = createInsertSchema(userBadges).omit({ 
  id: true,
  earnedAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Language = typeof languages.$inferSelect;
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;

export type Module = typeof modules.$inferSelect;
export type InsertModule = z.infer<typeof insertModuleSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;

export type UserBadge = typeof userBadges.$inferSelect;
export type InsertUserBadge = z.infer<typeof insertUserBadgeSchema>;
