import { 
  users, type User, type InsertUser,
  languages, type Language, type InsertLanguage,
  modules, type Module, type InsertModule,
  lessons, type Lesson, type InsertLesson,
  challenges, type Challenge, type InsertChallenge,
  userProgress, type UserProgress, type InsertUserProgress,
  badges, type Badge, type InsertBadge,
  userBadges, type UserBadge, type InsertUserBadge
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  updateUserLevel(userId: number, language: string, level: number): Promise<User | undefined>;
  updateUserPoints(userId: number, points: number): Promise<User | undefined>;
  
  // Language operations
  getLanguage(id: number): Promise<Language | undefined>;
  getLanguageByName(name: string): Promise<Language | undefined>;
  getLanguages(): Promise<Language[]>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  
  // Module operations
  getModule(id: number): Promise<Module | undefined>;
  getModules(languageId: number): Promise<Module[]>;
  getModulesByLevel(languageId: number, level: string): Promise<Module[]>;
  createModule(module: InsertModule): Promise<Module>;
  
  // Lesson operations
  getLesson(id: number): Promise<Lesson | undefined>;
  getLessons(moduleId: number): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  
  // Challenge operations
  getChallenge(id: number): Promise<Challenge | undefined>;
  getChallenges(lessonId: number): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  // Progress tracking
  getUserProgress(userId: number, moduleId?: number): Promise<UserProgress[]>;
  getLessonProgress(userId: number, lessonId: number): Promise<UserProgress | undefined>;
  getChallengeProgress(userId: number, challengeId: number): Promise<UserProgress | undefined>;
  updateProgress(progress: InsertUserProgress): Promise<UserProgress>;
  
  // Badges
  getBadge(id: number): Promise<Badge | undefined>;
  getBadges(): Promise<Badge[]>;
  getBadgesByCategory(category: string): Promise<Badge[]>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  
  // User badges
  getUserBadges(userId: number): Promise<UserBadge[]>;
  awardBadge(userBadge: InsertUserBadge): Promise<UserBadge>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private languages: Map<number, Language>;
  private modules: Map<number, Module>;
  private lessons: Map<number, Lesson>;
  private challenges: Map<number, Challenge>;
  private userProgress: Map<string, UserProgress>; // key: userId-[moduleId/lessonId/challengeId]
  private badges: Map<number, Badge>;
  private userBadges: Map<string, UserBadge>; // key: userId-badgeId
  
  private userIdCounter: number;
  private languageIdCounter: number;
  private moduleIdCounter: number;
  private lessonIdCounter: number;
  private challengeIdCounter: number;
  private userProgressIdCounter: number;
  private badgeIdCounter: number;
  private userBadgeIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.languages = new Map();
    this.modules = new Map();
    this.lessons = new Map();
    this.challenges = new Map();
    this.userProgress = new Map();
    this.badges = new Map();
    this.userBadges = new Map();
    
    this.userIdCounter = 1;
    this.languageIdCounter = 1;
    this.moduleIdCounter = 1;
    this.lessonIdCounter = 1;
    this.challengeIdCounter = 1;
    this.userProgressIdCounter = 1;
    this.badgeIdCounter = 1;
    this.userBadgeIdCounter = 1;
    
    // Add sample data
    this.initSampleData();
  }
  
  private initSampleData() {
    // Create creator
    this.createUser({
      username: "admin",
      password: "admin123",
      email: "admin@malasngoding.com",
      displayName: "Levi Setiadi",
      bio: "Creator of Malas Ngoding",
      role: "admin",
      avatarUrl: "https://ui-avatars.com/api/?name=Levi+Setiadi&background=6d28d9&color=fff"
    });
    
    // Create sample user
    this.createUser({
      username: "user",
      password: "user123",
      email: "user@malasngoding.com",
      displayName: "Demo User",
      bio: "Learning to code",
      role: "student",
      avatarUrl: "https://ui-avatars.com/api/?name=Demo+User&background=a78bfa&color=fff"
    });
    
    // Create programming languages
    const htmlLang = this.createLanguage({
      name: "html",
      displayName: "HTML",
      description: "Learn to create the structure of web pages with HTML",
      iconUrl: "/icons/html.svg",
      color: "#E34F26"
    });
    
    const cssLang = this.createLanguage({
      name: "css",
      displayName: "CSS",
      description: "Style your web pages with CSS",
      iconUrl: "/icons/css.svg",
      color: "#1572B6"
    });
    
    const jsLang = this.createLanguage({
      name: "javascript",
      displayName: "JavaScript",
      description: "Add interactivity to your websites with JavaScript",
      iconUrl: "/icons/javascript.svg",
      color: "#F7DF1E"
    });
    
    // Create HTML modules (levels)
    this.createModule({
      languageId: 1, // HTML
      title: "HTML Basics",
      description: "Learn the fundamentals of HTML",
      level: "easy",
      levelNumber: 1,
      thumbnailUrl: "/images/modules/html-basics.png",
      sortOrder: 1,
      pointsToEarn: 20
    });
    
    this.createModule({
      languageId: 1, // HTML
      title: "HTML Forms & Tables",
      description: "Create interactive forms and structured tables",
      level: "medium",
      levelNumber: 2,
      thumbnailUrl: "/images/modules/html-forms-tables.png",
      sortOrder: 2,
      pointsToEarn: 30
    });
    
    this.createModule({
      languageId: 1, // HTML
      title: "HTML5 Advanced Features",
      description: "Master semantic HTML5 and advanced features",
      level: "hard",
      levelNumber: 3,
      thumbnailUrl: "/images/modules/html-advanced.png",
      sortOrder: 3,
      pointsToEarn: 50
    });
    
    // Create CSS modules
    this.createModule({
      languageId: 2, // CSS
      title: "CSS Fundamentals",
      description: "Learn basic CSS properties and selectors",
      level: "easy",
      levelNumber: 1,
      thumbnailUrl: "/images/modules/css-basics.png",
      sortOrder: 1,
      pointsToEarn: 20
    });
    
    this.createModule({
      languageId: 2, // CSS
      title: "CSS Layout & Positioning",
      description: "Master CSS layouts with flexbox and grid",
      level: "medium",
      levelNumber: 2,
      thumbnailUrl: "/images/modules/css-layout.png",
      sortOrder: 2,
      pointsToEarn: 30
    });
    
    this.createModule({
      languageId: 2, // CSS
      title: "CSS Animations & Responsive Design",
      description: "Create animations and responsive websites",
      level: "hard",
      levelNumber: 3,
      thumbnailUrl: "/images/modules/css-animations.png",
      sortOrder: 3,
      pointsToEarn: 50
    });
    
    // Create JS modules
    this.createModule({
      languageId: 3, // JavaScript
      title: "JavaScript Basics",
      description: "Learn JavaScript syntax and basic concepts",
      level: "easy",
      levelNumber: 1,
      thumbnailUrl: "/images/modules/js-basics.png",
      sortOrder: 1,
      pointsToEarn: 20
    });
    
    this.createModule({
      languageId: 3, // JavaScript
      title: "JavaScript DOM Manipulation",
      description: "Learn to interact with the webpage using JavaScript",
      level: "medium",
      levelNumber: 2,
      thumbnailUrl: "/images/modules/js-dom.png",
      sortOrder: 2,
      pointsToEarn: 40
    });
    
    this.createModule({
      languageId: 3, // JavaScript
      title: "JavaScript Advanced Concepts",
      description: "Master advanced JavaScript concepts and patterns",
      level: "hard",
      levelNumber: 3,
      thumbnailUrl: "/images/modules/js-advanced.png",
      sortOrder: 3,
      pointsToEarn: 60
    });
    
    // Create HTML lessons for Module 1
    this.createLesson({
      moduleId: 1,
      title: "Introduction to HTML",
      description: "Learn about HTML and its purpose",
      content: `
        <h1>Introduction to HTML</h1>
        <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page.</p>
        <p>HTML consists of a series of elements that tell the browser how to display the content.</p>
      `,
      codeExample: `<!DOCTYPE html>
<html>
  <head>
    <title>My First Webpage</title>
  </head>
  <body>
    <h1>Hello, World!</h1>
    <p>This is my first webpage.</p>
  </body>
</html>`,
      previewHtml: `<h1>Hello, World!</h1><p>This is my first webpage.</p>`,
      sortOrder: 1
    });
    
    this.createLesson({
      moduleId: 1,
      title: "HTML Elements",
      description: "Learn about HTML elements and tags",
      content: `
        <h1>HTML Elements</h1>
        <p>HTML elements are defined by tags, which are keywords surrounded by angle brackets.</p>
        <p>HTML tags normally come in pairs like <code>&lt;p&gt;</code> and <code>&lt;/p&gt;</code>. The first tag in a pair is the start tag, the second tag is the end tag.</p>
      `,
      codeExample: `<h1>This is a heading</h1>
<p>This is a paragraph.</p>
<a href="https://www.example.com">This is a link</a>
<img src="image.jpg" alt="This is an image">`,
      previewHtml: `<h1>This is a heading</h1><p>This is a paragraph.</p><a>This is a link</a>`,
      sortOrder: 2
    });
    
    // Create challenges for HTML Lesson 1
    this.createChallenge({
      lessonId: 1,
      title: "Create Your First HTML Document",
      description: "Create a complete HTML document structure",
      instructions: "Create a basic HTML document with proper DOCTYPE, html, head, and body tags. Include a title and a heading inside the body.",
      initialCode: `<!-- Write your HTML code here -->`,
      expectedOutput: `<!DOCTYPE html>
<html>
<head>
  <title>My Page</title>
</head>
<body>
  <h1>My First Heading</h1>
</body>
</html>`,
      hints: ["Don't forget to include the DOCTYPE declaration", "The <title> goes inside the <head> section", "The heading <h1> goes inside the <body> section"],
      sortOrder: 1,
      points: 5
    });
    
    // Create badges
    this.createBadge({
      title: "HTML Beginner",
      description: "Completed the HTML Basics module",
      imageUrl: "/badges/html-beginner.svg",
      category: "html",
      requiredPoints: 20,
      level: "beginner"
    });
    
    this.createBadge({
      title: "CSS Beginner",
      description: "Completed the CSS Fundamentals module",
      imageUrl: "/badges/css-beginner.svg",
      category: "css",
      requiredPoints: 20,
      level: "beginner"
    });
    
    this.createBadge({
      title: "JavaScript Beginner",
      description: "Completed the JavaScript Basics module",
      imageUrl: "/badges/js-beginner.svg",
      category: "javascript",
      requiredPoints: 20,
      level: "beginner"
    });
    
    this.createBadge({
      title: "Code Master",
      description: "Completed all modules with a total of 300+ points",
      imageUrl: "/badges/code-master.svg",
      category: "general",
      requiredPoints: 300,
      level: "advanced"
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { 
      ...user, 
      id, 
      createdAt: new Date(),
      htmlLevel: 1,
      cssLevel: 1,
      jsLevel: 1,
      totalPoints: 0
    };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  async updateUserLevel(userId: number, language: string, level: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user };
    
    if (language === 'html') {
      updatedUser.htmlLevel = level;
    } else if (language === 'css') {
      updatedUser.cssLevel = level;
    } else if (language === 'javascript') {
      updatedUser.jsLevel = level;
    }
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async updateUserPoints(userId: number, points: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { 
      ...user,
      totalPoints: user.totalPoints + points
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Language operations
  async getLanguage(id: number): Promise<Language | undefined> {
    return this.languages.get(id);
  }
  
  async getLanguageByName(name: string): Promise<Language | undefined> {
    return Array.from(this.languages.values()).find(
      (language) => language.name === name
    );
  }
  
  async getLanguages(): Promise<Language[]> {
    return Array.from(this.languages.values());
  }
  
  async createLanguage(language: InsertLanguage): Promise<Language> {
    const id = this.languageIdCounter++;
    const newLanguage: Language = { 
      ...language, 
      id
    };
    this.languages.set(id, newLanguage);
    return newLanguage;
  }
  
  // Module operations
  async getModule(id: number): Promise<Module | undefined> {
    return this.modules.get(id);
  }
  
  async getModules(languageId: number): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter(module => module.languageId === languageId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  
  async getModulesByLevel(languageId: number, level: string): Promise<Module[]> {
    return Array.from(this.modules.values())
      .filter(module => module.languageId === languageId && module.level === level)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  
  async createModule(module: InsertModule): Promise<Module> {
    const id = this.moduleIdCounter++;
    const newModule: Module = {
      ...module,
      id
    };
    this.modules.set(id, newModule);
    return newModule;
  }
  
  // Lesson operations
  async getLesson(id: number): Promise<Lesson | undefined> {
    return this.lessons.get(id);
  }
  
  async getLessons(moduleId: number): Promise<Lesson[]> {
    return Array.from(this.lessons.values())
      .filter(lesson => lesson.moduleId === moduleId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  
  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const id = this.lessonIdCounter++;
    const newLesson: Lesson = {
      ...lesson,
      id
    };
    this.lessons.set(id, newLesson);
    return newLesson;
  }
  
  // Challenge operations
  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }
  
  async getChallenges(lessonId: number): Promise<Challenge[]> {
    return Array.from(this.challenges.values())
      .filter(challenge => challenge.lessonId === lessonId)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  
  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const id = this.challengeIdCounter++;
    const newChallenge: Challenge = {
      ...challenge,
      id
    };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }
  
  // Progress tracking
  async getUserProgress(userId: number, moduleId?: number): Promise<UserProgress[]> {
    const progressEntries = Array.from(this.userProgress.values())
      .filter(progress => progress.userId === userId);
      
    if (moduleId) {
      return progressEntries.filter(progress => progress.moduleId === moduleId);
    }
    
    return progressEntries;
  }
  
  async getLessonProgress(userId: number, lessonId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-lesson-${lessonId}`;
    return this.userProgress.get(key);
  }
  
  async getChallengeProgress(userId: number, challengeId: number): Promise<UserProgress | undefined> {
    const key = `${userId}-challenge-${challengeId}`;
    return this.userProgress.get(key);
  }
  
  async updateProgress(progress: InsertUserProgress): Promise<UserProgress> {
    let progressType = "module";
    let typeId = progress.moduleId;
    
    if (progress.lessonId) {
      progressType = "lesson";
      typeId = progress.lessonId;
    } else if (progress.challengeId) {
      progressType = "challenge";
      typeId = progress.challengeId;
    }
    
    const key = `${progress.userId}-${progressType}-${typeId}`;
    let existingProgress = this.userProgress.get(key);
    
    if (existingProgress) {
      existingProgress = {
        ...existingProgress,
        ...progress,
        lastAccessed: new Date()
      };
      this.userProgress.set(key, existingProgress);
      return existingProgress;
    }
    
    const id = this.userProgressIdCounter++;
    const newProgress: UserProgress = {
      ...progress,
      id,
      lastAccessed: new Date()
    };
    
    this.userProgress.set(key, newProgress);
    return newProgress;
  }
  
  // Badges
  async getBadge(id: number): Promise<Badge | undefined> {
    return this.badges.get(id);
  }
  
  async getBadges(): Promise<Badge[]> {
    return Array.from(this.badges.values());
  }
  
  async getBadgesByCategory(category: string): Promise<Badge[]> {
    return Array.from(this.badges.values())
      .filter(badge => badge.category === category);
  }
  
  async createBadge(badge: InsertBadge): Promise<Badge> {
    const id = this.badgeIdCounter++;
    const newBadge: Badge = {
      ...badge,
      id
    };
    this.badges.set(id, newBadge);
    return newBadge;
  }
  
  // User badges
  async getUserBadges(userId: number): Promise<UserBadge[]> {
    return Array.from(this.userBadges.values())
      .filter(userBadge => userBadge.userId === userId)
      .sort((a, b) => b.earnedAt.getTime() - a.earnedAt.getTime());
  }
  
  async awardBadge(userBadge: InsertUserBadge): Promise<UserBadge> {
    const key = `${userBadge.userId}-${userBadge.badgeId}`;
    
    // Check if badge is already awarded
    const existingBadge = this.userBadges.get(key);
    if (existingBadge) return existingBadge;
    
    const id = this.userBadgeIdCounter++;
    const newUserBadge: UserBadge = {
      ...userBadge,
      id,
      earnedAt: new Date()
    };
    
    this.userBadges.set(key, newUserBadge);
    return newUserBadge;
  }
}

export const storage = new MemStorage();
