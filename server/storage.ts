import { 
  users, 
  expenses, 
  budgets, 
  userBalances,
  type User, 
  type InsertUser,
  type Expense,
  type InsertExpense,
  type Budget,
  type InsertBudget,
  type UserBalance,
  type InsertUserBalance
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Expense methods
  createExpense(expense: {
    userId: number;
    name: string;
    amount: string;
    category: string;
    date: Date;
  }): Promise<Expense>;
  getExpensesByUserId(userId: number): Promise<Expense[]>;
  getExpensesByUserIdAndDateRange(userId: number, startDate: Date, endDate: Date): Promise<Expense[]>;
  
  // Budget methods
  createOrUpdateBudget(budget: {
    userId: number;
    amount: string;
    period: string;
  }): Promise<Budget>;
  getBudgetByUserId(userId: number): Promise<Budget | undefined>;
  
  // User balance methods
  createOrUpdateUserBalance(balance: {
    userId: number;
    balance: string;
  }): Promise<UserBalance>;
  getUserBalanceByUserId(userId: number): Promise<UserBalance | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Expense methods
  async createExpense(expenseData: {
    userId: number;
    name: string;
    amount: string;
    category: string;
    date: Date;
  }): Promise<Expense> {
    const [newExpense] = await db
      .insert(expenses)
      .values({
        userId: expenseData.userId,
        name: expenseData.name,
        amount: expenseData.amount,
        category: expenseData.category,
        date: expenseData.date
      })
      .returning();
    return newExpense;
  }

  async getExpensesByUserId(userId: number): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, userId))
      .orderBy(desc(expenses.date));
  }

  async getExpensesByUserIdAndDateRange(userId: number, startDate: Date, endDate: Date): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(
        and(
          eq(expenses.userId, userId),
          gte(expenses.date, startDate),
          lte(expenses.date, endDate)
        )
      )
      .orderBy(desc(expenses.date));
  }

  // Budget methods
  async createOrUpdateBudget(budgetData: {
    userId: number;
    amount: string;
    period: string;
  }): Promise<Budget> {
    const existingBudget = await this.getBudgetByUserId(budgetData.userId);
    
    if (existingBudget) {
      const [updatedBudget] = await db
        .update(budgets)
        .set({ 
          amount: budgetData.amount, 
          period: budgetData.period,
          updatedAt: new Date()
        })
        .where(eq(budgets.userId, budgetData.userId))
        .returning();
      return updatedBudget;
    } else {
      const [newBudget] = await db
        .insert(budgets)
        .values({
          userId: budgetData.userId,
          amount: budgetData.amount,
          period: budgetData.period
        })
        .returning();
      return newBudget;
    }
  }

  async getBudgetByUserId(userId: number): Promise<Budget | undefined> {
    const [budget] = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, userId));
    return budget || undefined;
  }

  // User balance methods
  async createOrUpdateUserBalance(balanceData: {
    userId: number;
    balance: string;
  }): Promise<UserBalance> {
    const existingBalance = await this.getUserBalanceByUserId(balanceData.userId);
    
    if (existingBalance) {
      const [updatedBalance] = await db
        .update(userBalances)
        .set({ 
          balance: balanceData.balance,
          updatedAt: new Date()
        })
        .where(eq(userBalances.userId, balanceData.userId))
        .returning();
      return updatedBalance;
    } else {
      const [newBalance] = await db
        .insert(userBalances)
        .values({
          userId: balanceData.userId,
          balance: balanceData.balance
        })
        .returning();
      return newBalance;
    }
  }

  async getUserBalanceByUserId(userId: number): Promise<UserBalance | undefined> {
    const [balance] = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, userId));
    return balance || undefined;
  }
}

export const storage = new DatabaseStorage();