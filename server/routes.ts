import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertExpenseSchema, 
  insertBudgetSchema, 
  insertUserBalanceSchema, 
  insertIncomeSchema,
  insertUserSettingsSchema,
  insertArchiveSchema,
  insertArchiveDetailSchema,
  loginSchema, 
  registerSchema 
} from "@shared/schema";
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

  // Complete onboarding
  app.post('/api/auth/complete-onboarding', async (req: any, res) => {
    try {
      const { isCompleted } = req.body;
      let userId: string | null = null;
      
      // Try OAuth first
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      }
      
      // Try JWT token
      if (!userId) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (token) {
          try {
            const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
            userId = decoded.id;
          } catch (error) {
            return res.status(401).json({ message: "Unauthorized" });
          }
        }
      }
      
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const updatedUser = await storage.updateUserOnboardingStatus(userId, isCompleted);
      
      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        isNewUser: updatedUser.isNewUser,
      });
    } catch (error) {
      console.error('Complete onboarding error:', error);
      res.status(500).json({ message: "Internal server error" });
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

  // Income routes for new income tracking feature
  app.post("/api/incomes", async (req, res) => {
    try {
      const incomeData = insertIncomeSchema.parse(req.body);
      const income = await storage.createIncome(incomeData);
      res.json(income);
    } catch (error) {
      console.error(`Error creating income: ${error}`);
      res.status(400).json({ error: "Invalid income data" });
    }
  });

  app.get("/api/incomes/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const incomes = await storage.getIncomesByUserId(userId);
      res.json(incomes);
    } catch (error) {
      console.error(`Error fetching incomes: ${error}`);
      res.status(500).json({ error: "Failed to fetch incomes" });
    }
  });

  // User settings routes for budget cycle management
  app.post("/api/user-settings", async (req, res) => {
    try {
      const settingsData = insertUserSettingsSchema.parse(req.body);
      const settings = await storage.createOrUpdateUserSettings(settingsData);
      res.json(settings);
    } catch (error) {
      console.error(`Error creating/updating user settings: ${error}`);
      res.status(400).json({ error: "Invalid settings data" });
    }
  });

  app.get("/api/user-settings/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const settings = await storage.getUserSettingsByUserId(userId);
      res.json(settings);
    } catch (error) {
      console.error(`Error fetching user settings: ${error}`);
      res.status(500).json({ error: "Failed to fetch user settings" });
    }
  });

  // Archive routes for Memory feature
  app.post("/api/archives", async (req, res) => {
    try {
      const archiveData = insertArchiveSchema.parse(req.body);
      const archive = await storage.createArchive(archiveData);
      res.json(archive);
    } catch (error) {
      console.error(`Error creating archive: ${error}`);
      res.status(400).json({ error: "Invalid archive data" });
    }
  });

  app.get("/api/archives/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      const archives = await storage.getArchivesByUserId(userId);
      res.json(archives);
    } catch (error) {
      console.error(`Error fetching archives: ${error}`);
      res.status(500).json({ error: "Failed to fetch archives" });
    }
  });

  // Archive details routes for detailed transaction history
  app.post("/api/archive-details", async (req, res) => {
    try {
      const detailData = insertArchiveDetailSchema.parse(req.body);
      const detail = await storage.createArchiveDetail(detailData);
      res.json(detail);
    } catch (error) {
      console.error(`Error creating archive detail: ${error}`);
      res.status(400).json({ error: "Invalid archive detail data" });
    }
  });

  app.get("/api/archive-details/archive/:archiveId", async (req, res) => {
    try {
      const archiveId = parseInt(req.params.archiveId);
      const details = await storage.getArchiveDetailsByArchiveId(archiveId);
      res.json(details);
    } catch (error) {
      console.error(`Error fetching archive details: ${error}`);
      res.status(500).json({ error: "Failed to fetch archive details" });
    }
  });

  // Auto-reset API endpoint for budget cycle resets
  app.post("/api/auto-reset/user/:userId", async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Get current user data before reset
      const [expenses, incomes, balance, budget, settings] = await Promise.all([
        storage.getExpensesByUserId(userId),
        storage.getIncomesByUserId(userId),
        storage.getUserBalanceByUserId(userId),
        storage.getBudgetByUserId(userId),
        storage.getUserSettingsByUserId(userId)
      ]);

      if (!settings) {
        return res.status(400).json({ error: "User settings not found" });
      }

      // Calculate totals for archive
      const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0);
      const totalIncomes = incomes.reduce((sum, inc) => sum + parseFloat(inc.amount.toString()), 0);
      const initialBalance = balance ? parseFloat(balance.balance.toString()) : 0;
      const netResult = totalIncomes - totalExpenses;

      // Create archive record
      const archive = await storage.createArchive({
        userId,
        periodType: settings.budgetCycle,
        startDate: settings.lastResetDate,
        endDate: new Date(),
        initialBalance: initialBalance.toString(),
        finalBalance: (initialBalance + netResult).toString(),
        totalExpenses: totalExpenses.toString(),
        totalIncomes: totalIncomes.toString(),
        netResult: netResult.toString(),
        expenseCount: expenses.length,
        incomeCount: incomes.length,
      });

      // Archive all transaction details
      for (const expense of expenses) {
        await storage.createArchiveDetail({
          archiveId: archive.id,
          type: 'expense',
          name: expense.name,
          amount: expense.amount.toString(),
          category: expense.category,
          originalDate: expense.date,
        });
      }

      for (const income of incomes) {
        await storage.createArchiveDetail({
          archiveId: archive.id,
          type: 'income',
          name: income.source,
          amount: income.amount.toString(),
          source: income.source,
          originalDate: income.date,
        });
      }

      // Clear all user data for fresh start
      await Promise.all([
        storage.deleteExpensesByUserId(userId),
        storage.deleteIncomesByUserId(userId),
        storage.deleteBudgetByUserId(userId)
      ]);

      // Reset balance to 0
      await storage.createOrUpdateUserBalance({
        userId,
        balance: "0"
      });

      // Update settings with new reset dates
      const nextResetDate = new Date();
      switch (settings.budgetCycle) {
        case 'biweekly':
          nextResetDate.setDate(nextResetDate.getDate() + 14);
          break;
        case 'monthly':
          nextResetDate.setMonth(nextResetDate.getMonth() + 1);
          break;
        case 'six_months':
          nextResetDate.setMonth(nextResetDate.getMonth() + 6);
          break;
      }

      await storage.createOrUpdateUserSettings({
        userId,
        budgetCycle: settings.budgetCycle,
        lastResetDate: new Date(),
        nextResetDate,
        autoResetEnabled: settings.autoResetEnabled,
      });

      res.json({ 
        success: true, 
        message: "Auto-reset completed successfully",
        archiveId: archive.id,
        archivedTransactions: expenses.length + incomes.length
      });
    } catch (error) {
      console.error(`Error during auto-reset: ${error}`);
      res.status(500).json({ error: "Auto-reset failed" });
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
