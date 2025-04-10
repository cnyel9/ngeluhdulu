import type { Express, Request as ExpressRequest, Response } from "express";
import { createServer, type Server } from "http";

// Extend Request to include user data
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}

// Alias the extended Request
type Request = ExpressRequest;
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertLanguageSchema,
  insertModuleSchema,
  insertLessonSchema,
  insertChallengeSchema,
  insertUserProgressSchema,
  insertBadgeSchema,
  insertUserBadgeSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Authentication middleware
  const authenticateUser = (req: Request, res: Response, next: Function) => {
    // In a real app this would verify JWT or session
    // For this example, we'll just check for a user_id in the request
    const userId = Number(req.headers["user_id"]);
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Attach the user to the request
    req.user = { id: userId };
    next();
  };

  // === User Routes ===
  
  // Register user
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(409).json({ message: "Email already exists" });
      }
      
      // Create user (in a real app, we would hash the password)
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  // Login user
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) { // In real app, compare hashed passwords
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  });

  // Get user profile
  app.get("/api/users/profile", authenticateUser, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile" });
    }
  });

  // Update user profile
  app.patch("/api/users/profile", authenticateUser, async (req, res) => {
    try {
      const userData = req.body;
      
      // Don't allow password updates via this endpoint
      if (userData.password) {
        delete userData.password;
      }
      
      const updatedUser = await storage.updateUser(req.user.id, userData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Error updating user profile" });
    }
  });

  // === Language Routes ===
  
  // Get all languages
  app.get("/api/languages", async (req, res) => {
    try {
      const languages = await storage.getLanguages();
      res.json(languages);
    } catch (error) {
      res.status(500).json({ message: "Error fetching languages" });
    }
  });

  // Get language by ID
  app.get("/api/languages/:id", async (req, res) => {
    try {
      const languageId = Number(req.params.id);
      const language = await storage.getLanguage(languageId);
      
      if (!language) {
        return res.status(404).json({ message: "Language not found" });
      }
      
      res.json(language);
    } catch (error) {
      res.status(500).json({ message: "Error fetching language" });
    }
  });

  // === Module Routes ===
  
  // Get modules by language ID
  app.get("/api/languages/:languageId/modules", async (req, res) => {
    try {
      const languageId = Number(req.params.languageId);
      const modules = await storage.getModules(languageId);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Error fetching modules" });
    }
  });

  // Get module by ID
  app.get("/api/modules/:id", async (req, res) => {
    try {
      const moduleId = Number(req.params.id);
      const module = await storage.getModule(moduleId);
      
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      res.json(module);
    } catch (error) {
      res.status(500).json({ message: "Error fetching module" });
    }
  });

  // Get modules by language and level
  app.get("/api/languages/:languageId/modules/level/:level", async (req, res) => {
    try {
      const languageId = Number(req.params.languageId);
      const level = req.params.level;
      const modules = await storage.getModulesByLevel(languageId, level);
      res.json(modules);
    } catch (error) {
      res.status(500).json({ message: "Error fetching modules by level" });
    }
  });

  // === Lesson Routes ===
  
  // Get lessons by module ID
  app.get("/api/modules/:moduleId/lessons", async (req, res) => {
    try {
      const moduleId = Number(req.params.moduleId);
      const lessons = await storage.getLessons(moduleId);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Error fetching lessons" });
    }
  });

  // Get lesson by ID
  app.get("/api/lessons/:id", async (req, res) => {
    try {
      const lessonId = Number(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Error fetching lesson" });
    }
  });

  // === Challenge Routes ===
  
  // Get challenges by lesson ID
  app.get("/api/lessons/:lessonId/challenges", async (req, res) => {
    try {
      const lessonId = Number(req.params.lessonId);
      const challenges = await storage.getChallenges(lessonId);
      res.json(challenges);
    } catch (error) {
      res.status(500).json({ message: "Error fetching challenges" });
    }
  });

  // Get challenge by ID
  app.get("/api/challenges/:id", async (req, res) => {
    try {
      const challengeId = Number(req.params.id);
      const challenge = await storage.getChallenge(challengeId);
      
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      
      res.json(challenge);
    } catch (error) {
      res.status(500).json({ message: "Error fetching challenge" });
    }
  });

  // === User Progress Routes ===
  
  // Get user progress
  app.get("/api/progress", authenticateUser, async (req, res) => {
    try {
      const moduleId = req.query.moduleId ? Number(req.query.moduleId) : undefined;
      const progress = await storage.getUserProgress(req.user.id, moduleId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Error fetching progress" });
    }
  });

  // Get lesson progress
  app.get("/api/lessons/:lessonId/progress", authenticateUser, async (req, res) => {
    try {
      const lessonId = Number(req.params.lessonId);
      const progress = await storage.getLessonProgress(req.user.id, lessonId);
      res.json(progress || { completed: false, pointsEarned: 0 });
    } catch (error) {
      res.status(500).json({ message: "Error fetching lesson progress" });
    }
  });

  // Get challenge progress
  app.get("/api/challenges/:challengeId/progress", authenticateUser, async (req, res) => {
    try {
      const challengeId = Number(req.params.challengeId);
      const progress = await storage.getChallengeProgress(req.user.id, challengeId);
      res.json(progress || { completed: false, pointsEarned: 0 });
    } catch (error) {
      res.status(500).json({ message: "Error fetching challenge progress" });
    }
  });

  // Update progress
  app.post("/api/progress", authenticateUser, async (req, res) => {
    try {
      const progressData = insertUserProgressSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      
      const progress = await storage.updateProgress(progressData);
      
      // If the progress is complete and points were earned, update user points
      if (progress.completed && progress.pointsEarned > 0) {
        await storage.updateUserPoints(req.user.id, progress.pointsEarned);
        
        // If it's a module completion, update the user's level for that language's area
        if (progress.moduleId && !progress.lessonId && !progress.challengeId) {
          const module = await storage.getModule(progress.moduleId);
          if (module) {
            const language = await storage.getLanguage(module.languageId);
            if (language) {
              await storage.updateUserLevel(req.user.id, language.name, module.levelNumber);
            }
          }
        }
      }
      
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      res.status(500).json({ message: "Error updating progress" });
    }
  });

  // === Badge Routes ===
  
  // Get all badges
  app.get("/api/badges", async (req, res) => {
    try {
      const badges = await storage.getBadges();
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Error fetching badges" });
    }
  });

  // Get badges by category
  app.get("/api/badges/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const badges = await storage.getBadgesByCategory(category);
      res.json(badges);
    } catch (error) {
      res.status(500).json({ message: "Error fetching badges by category" });
    }
  });

  // Get user badges
  app.get("/api/user/badges", authenticateUser, async (req, res) => {
    try {
      const userBadges = await storage.getUserBadges(req.user.id);
      res.json(userBadges);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user badges" });
    }
  });

  // Award badge to user
  app.post("/api/user/badges", authenticateUser, async (req, res) => {
    try {
      const { badgeId } = req.body;
      
      if (!badgeId) {
        return res.status(400).json({ message: "Badge ID is required" });
      }
      
      const badge = await storage.getBadge(Number(badgeId));
      if (!badge) {
        return res.status(404).json({ message: "Badge not found" });
      }
      
      const userBadge = await storage.awardBadge({
        userId: req.user.id,
        badgeId: Number(badgeId)
      });
      
      res.status(201).json(userBadge);
    } catch (error) {
      res.status(500).json({ message: "Error awarding badge" });
    }
  });

  return httpServer;
}
