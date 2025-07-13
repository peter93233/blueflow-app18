import {
  users,
  expenses,
  budgets,
  userBalances,
  type User,
  type UpsertUser,
  type Expense,
  type Budget,
  type UserBalance,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface IStorage {
  // User methods - Updated for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Expense methods
  createExpense(expense: {
    userId: string;
    name: string;
    amount: string;
    category: string;
    date: Date;
  }): Promise<Expense>;
  getExpensesByUserId(userId: string): Promise<Expense[]>;
  getExpensesByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Expense[]>;
  
  // Budget methods
  createOrUpdateBudget(budget: {
    userId: string;
    amount: string;
    period: string;
  }): Promise<Budget>;
  getBudgetByUserId(userId: string): Promise<Budget | undefined>;
  
  // User balance methods
  createOrUpdateUserBalance(balance: {
    userId: string;
    balance: string;
  }): Promise<UserBalance>;
  getUserBalanceByUserId(userId: string): Promise<UserBalance | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations - Updated for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Expense operations
  async createExpense(expenseData: {
    userId: string;
    name: string;
    amount: string;
    category: string;
    date: Date;
  }): Promise<Expense> {
    const [expense] = await db
      .insert(expenses)
      .values(expenseData)
      .returning();
    return expense;
  }

  async getExpensesByUserId(userId: string): Promise<Expense[]> {
    return await db
      .select()
      .from(expenses)
      .where(eq(expenses.userId, userId))
      .orderBy(desc(expenses.date));
  }

  async getExpensesByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Expense[]> {
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

  // Budget operations
  async createOrUpdateBudget(budgetData: {
    userId: string;
    amount: string;
    period: string;
  }): Promise<Budget> {
    // First try to find existing budget
    const [existingBudget] = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, budgetData.userId));

    if (existingBudget) {
      // Update existing budget
      const [updatedBudget] = await db
        .update(budgets)
        .set({
          amount: budgetData.amount,
          period: budgetData.period,
          updatedAt: new Date(),
        })
        .where(eq(budgets.userId, budgetData.userId))
        .returning();
      return updatedBudget;
    } else {
      // Create new budget
      const [newBudget] = await db
        .insert(budgets)
        .values(budgetData)
        .returning();
      return newBudget;
    }
  }

  async getBudgetByUserId(userId: string): Promise<Budget | undefined> {
    const [budget] = await db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, userId));
    return budget;
  }

  // User balance operations
  async createOrUpdateUserBalance(balanceData: {
    userId: string;
    balance: string;
  }): Promise<UserBalance> {
    // First try to find existing balance
    const [existingBalance] = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, balanceData.userId));

    if (existingBalance) {
      // Update existing balance
      const [updatedBalance] = await db
        .update(userBalances)
        .set({
          balance: balanceData.balance,
          updatedAt: new Date(),
        })
        .where(eq(userBalances.userId, balanceData.userId))
        .returning();
      return updatedBalance;
    } else {
      // Create new balance
      const [newBalance] = await db
        .insert(userBalances)
        .values(balanceData)
        .returning();
      return newBalance;
    }
  }

  async getUserBalanceByUserId(userId: string): Promise<UserBalance | undefined> {
    const [balance] = await db
      .select()
      .from(userBalances)
      .where(eq(userBalances.userId, userId));
    return balance;
  }
}

export const storage = new DatabaseStorage();