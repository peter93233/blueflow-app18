import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExpenseSchema, insertBudgetSchema, insertUserBalanceSchema, loginSchema, registerSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Simple authentication middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.SESSION_SECRET!);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };

  // Traditional auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { name, email, password } = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create user with simple ID generation
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const user = await storage.createUser({
        id: userId,
        email,
        name,
        password: hashedPassword,
      });
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.SESSION_SECRET!,
        { expiresIn: '7d' }
      );
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      
      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name },
        process.env.SESSION_SECRET!,
        { expiresIn: '7d' }
      );
      
      res.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Login failed" });
    }
  });

  // Get current user (for both OAuth and traditional auth)
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Try OAuth first
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        return res.json(user);
      }
      
      // Try JWT token
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
          const user = await storage.getUser(decoded.id);
          return res.json(user);
        } catch (error) {
          return res.status(401).json({ message: "Unauthorized" });
        }
      }
      
      return res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // API Routes
  
  // Expense routes
  app.post("/api/expenses", async (req, res) => {
    try {
      const expenseData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(expenseData);
      res.json(expense);
    } catch (error) {
      console.error(`Error creating expense: ${error}`);
      res.status(400).json({ error: "Invalid expense data" });
    }
  });

  app.get("/api/expenses/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const expenses = await storage.getExpensesByUserId(userId);
      res.json(expenses);
    } catch (error) {
      console.error(`Error fetching expenses: ${error}`);
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  // Budget routes
  app.post("/api/budgets", async (req, res) => {
    try {
      const budgetData = insertBudgetSchema.parse(req.body);
      const budget = await storage.createOrUpdateBudget(budgetData);
      res.json(budget);
    } catch (error) {
      console.error(`Error creating/updating budget: ${error}`);
      res.status(400).json({ error: "Invalid budget data" });
    }
  });

  app.get("/api/budgets/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const budget = await storage.getBudgetByUserId(userId);
      res.json(budget);
    } catch (error) {
      console.error(`Error fetching budget: ${error}`);
      res.status(500).json({ error: "Failed to fetch budget" });
    }
  });

  // User balance routes
  app.post("/api/balances", async (req, res) => {
    try {
      const balanceData = insertUserBalanceSchema.parse(req.body);
      const balance = await storage.createOrUpdateUserBalance(balanceData);
      res.json(balance);
    } catch (error) {
      console.error(`Error creating/updating balance: ${error}`);
      res.status(400).json({ error: "Invalid balance data" });
    }
  });

  app.get("/api/balances/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const balance = await storage.getUserBalanceByUserId(userId);
      res.json(balance);
    } catch (error) {
      console.error(`Error fetching balance: ${error}`);
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });

  // Test route for database connection
  app.get("/api/test", async (req, res) => {
    try {
      // Test database connection by creating a test user
      const testUser = await storage.upsertUser({
        id: "test-user",
        email: "test@example.com",
        firstName: "Test",
        lastName: "User",
      });
      res.json({ message: "Database connected!", user: testUser });
    } catch (error) {
      console.error(`Database connection error: ${error}`);
      res.status(500).json({ error: "Database connection failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
