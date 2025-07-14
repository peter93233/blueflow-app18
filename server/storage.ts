import {
  users,
  expenses,
  budgets,
  userBalances,
  incomes,
  userSettings,
  archives,
  archiveDetails,
  type User,
  type UpsertUser,
  type Expense,
  type Budget,
  type UserBalance,
  type Income,
  type UserSettings,
  type Archive,
  type ArchiveDetail,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface IStorage {
  // User methods - Updated for both OAuth and traditional auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: UpsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserOnboardingStatus(userId: string, isCompleted: boolean): Promise<User>;
  
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
  deleteExpensesByUserId(userId: string): Promise<void>;
  
  // Income methods
  createIncome(income: {
    userId: string;
    amount: string;
    source: string;
    date: Date;
  }): Promise<Income>;
  getIncomesByUserId(userId: string): Promise<Income[]>;
  getIncomesByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Income[]>;
  deleteIncomesByUserId(userId: string): Promise<void>;
  
  // Budget methods
  createOrUpdateBudget(budget: {
    userId: string;
    amount: string;
    period: string;
  }): Promise<Budget>;
  getBudgetByUserId(userId: string): Promise<Budget | undefined>;
  deleteBudgetByUserId(userId: string): Promise<void>;
  
  // User balance methods
  createOrUpdateUserBalance(balance: {
    userId: string;
    balance: string;
  }): Promise<UserBalance>;
  getUserBalanceByUserId(userId: string): Promise<UserBalance | undefined>;
  
  // User settings methods
  createOrUpdateUserSettings(settings: {
    userId: string;
    budgetCycle: 'biweekly' | 'monthly' | 'six_months';
    lastResetDate: Date;
    nextResetDate: Date;
    autoResetEnabled: number;
  }): Promise<UserSettings>;
  getUserSettingsByUserId(userId: string): Promise<UserSettings | undefined>;
  
  // Archive methods
  createArchive(archive: {
    userId: string;
    periodType: string;
    startDate: Date;
    endDate: Date;
    initialBalance: string;
    finalBalance: string;
    totalExpenses: string;
    totalIncomes: string;
    netResult: string;
    expenseCount: number;
    incomeCount: number;
  }): Promise<Archive>;
  getArchivesByUserId(userId: string): Promise<Archive[]>;
  
  // Archive details methods
  createArchiveDetail(detail: {
    archiveId: number;
    type: 'expense' | 'income';
    name: string;
    amount: string;
    category?: string;
    source?: string;
    originalDate: Date;
  }): Promise<ArchiveDetail>;
  getArchiveDetailsByArchiveId(archiveId: number): Promise<ArchiveDetail[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - Updated for both OAuth and traditional auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
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

  async updateUserOnboardingStatus(userId: string, isCompleted: boolean): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        isNewUser: isCompleted ? 0 : 1,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
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

  // Income operations
  async createIncome(incomeData: {
    userId: string;
    amount: string;
    source: string;
    date: Date;
  }): Promise<Income> {
    const [income] = await db
      .insert(incomes)
      .values(incomeData)
      .returning();
    return income;
  }

  async getIncomesByUserId(userId: string): Promise<Income[]> {
    return await db
      .select()
      .from(incomes)
      .where(eq(incomes.userId, userId))
      .orderBy(desc(incomes.date));
  }

  async getIncomesByUserIdAndDateRange(userId: string, startDate: Date, endDate: Date): Promise<Income[]> {
    return await db
      .select()
      .from(incomes)
      .where(
        and(
          eq(incomes.userId, userId),
          gte(incomes.date, startDate),
          lte(incomes.date, endDate)
        )
      )
      .orderBy(desc(incomes.date));
  }

  async deleteIncomesByUserId(userId: string): Promise<void> {
    await db.delete(incomes).where(eq(incomes.userId, userId));
  }

  // Expense deletion for auto-reset
  async deleteExpensesByUserId(userId: string): Promise<void> {
    await db.delete(expenses).where(eq(expenses.userId, userId));
  }

  // Budget deletion for auto-reset
  async deleteBudgetByUserId(userId: string): Promise<void> {
    await db.delete(budgets).where(eq(budgets.userId, userId));
  }

  // User settings operations
  async createOrUpdateUserSettings(settingsData: {
    userId: string;
    budgetCycle: 'biweekly' | 'monthly' | 'six_months';
    lastResetDate: Date;
    nextResetDate: Date;
    autoResetEnabled: number;
  }): Promise<UserSettings> {
    const [settings] = await db
      .insert(userSettings)
      .values(settingsData)
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          budgetCycle: settingsData.budgetCycle,
          lastResetDate: settingsData.lastResetDate,
          nextResetDate: settingsData.nextResetDate,
          autoResetEnabled: settingsData.autoResetEnabled,
          updatedAt: new Date(),
        },
      })
      .returning();
    return settings;
  }

  async getUserSettingsByUserId(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings;
  }

  // Archive operations
  async createArchive(archiveData: {
    userId: string;
    periodType: string;
    startDate: Date;
    endDate: Date;
    initialBalance: string;
    finalBalance: string;
    totalExpenses: string;
    totalIncomes: string;
    netResult: string;
    expenseCount: number;
    incomeCount: number;
  }): Promise<Archive> {
    const [archive] = await db
      .insert(archives)
      .values(archiveData)
      .returning();
    return archive;
  }

  async getArchivesByUserId(userId: string): Promise<Archive[]> {
    return await db
      .select()
      .from(archives)
      .where(eq(archives.userId, userId))
      .orderBy(desc(archives.endDate));
  }

  // Archive details operations
  async createArchiveDetail(detailData: {
    archiveId: number;
    type: 'expense' | 'income';
    name: string;
    amount: string;
    category?: string;
    source?: string;
    originalDate: Date;
  }): Promise<ArchiveDetail> {
    const [detail] = await db
      .insert(archiveDetails)
      .values(detailData)
      .returning();
    return detail;
  }

  async getArchiveDetailsByArchiveId(archiveId: number): Promise<ArchiveDetail[]> {
    return await db
      .select()
      .from(archiveDetails)
      .where(eq(archiveDetails.archiveId, archiveId))
      .orderBy(desc(archiveDetails.originalDate));
  }
}

export const storage = new DatabaseStorage();