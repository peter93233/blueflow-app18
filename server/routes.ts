import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertExpenseSchema, insertBudgetSchema, insertUserBalanceSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
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
