import {
  pgTable,
  text,
  integer,
  numeric,
  timestamp,
  jsonb,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for both OAuth and traditional auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(), // OAuth compatibility
  email: varchar("email").unique().notNull(),
  name: varchar("name"), // For traditional auth
  password: varchar("password"), // For traditional auth (hashed)
  firstName: varchar("first_name"), // For OAuth
  lastName: varchar("last_name"), // For OAuth
  profileImageUrl: varchar("profile_image_url"), // For OAuth
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const budgets = pgTable("budgets", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  period: text("period").notNull(), // 'weekly', 'biweekly', 'monthly'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userBalances = pgTable("user_balances", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  balance: numeric("balance", { precision: 10, scale: 2 }).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Income tracking table for user income entries
export const incomes = pgTable("incomes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  source: text("source").notNull(), // e.g., "Salary", "Freelance", "Investment"
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User settings table for budget cycles and preferences
export const userSettings = pgTable("user_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  budgetCycle: text("budget_cycle").notNull().default('monthly'), // 'biweekly', 'monthly', 'six_months'
  lastResetDate: timestamp("last_reset_date").defaultNow().notNull(),
  nextResetDate: timestamp("next_reset_date").notNull(),
  autoResetEnabled: integer("auto_reset_enabled").notNull().default(1), // 1 = enabled, 0 = disabled
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Archive table for storing historical financial periods
export const archives = pgTable("archives", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  periodType: text("period_type").notNull(), // 'biweekly', 'monthly', 'six_months'
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  initialBalance: numeric("initial_balance", { precision: 10, scale: 2 }).notNull(),
  finalBalance: numeric("final_balance", { precision: 10, scale: 2 }).notNull(),
  totalExpenses: numeric("total_expenses", { precision: 10, scale: 2 }).notNull(),
  totalIncomes: numeric("total_incomes", { precision: 10, scale: 2 }).notNull(),
  netResult: numeric("net_result", { precision: 10, scale: 2 }).notNull(), // final - initial
  expenseCount: integer("expense_count").notNull(),
  incomeCount: integer("income_count").notNull(),
  archivedAt: timestamp("archived_at").defaultNow().notNull(),
});

// Archive details table for storing individual transactions in archives
export const archiveDetails = pgTable("archive_details", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  archiveId: integer("archive_id").notNull().references(() => archives.id),
  type: text("type").notNull(), // 'expense' or 'income'
  name: text("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  category: text("category"), // for expenses
  source: text("source"), // for incomes
  originalDate: timestamp("original_date").notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  expenses: many(expenses),
  incomes: many(incomes),
  budget: one(budgets),
  balance: one(userBalances),
  settings: one(userSettings),
  archives: many(archives),
}));

export const expensesRelations = relations(expenses, ({ one }) => ({
  user: one(users, {
    fields: [expenses.userId],
    references: [users.id],
  }),
}));

export const incomesRelations = relations(incomes, ({ one }) => ({
  user: one(users, {
    fields: [incomes.userId],
    references: [users.id],
  }),
}));

export const budgetsRelations = relations(budgets, ({ one }) => ({
  user: one(users, {
    fields: [budgets.userId],
    references: [users.id],
  }),
}));

export const userBalancesRelations = relations(userBalances, ({ one }) => ({
  user: one(users, {
    fields: [userBalances.userId],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
  user: one(users, {
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));

export const archivesRelations = relations(archives, ({ one, many }) => ({
  user: one(users, {
    fields: [archives.userId],
    references: [users.id],
  }),
  details: many(archiveDetails),
}));

export const archiveDetailsRelations = relations(archiveDetails, ({ one }) => ({
  archive: one(archives, {
    fields: [archiveDetails.archiveId],
    references: [archives.id],
  }),
}));

// Insert schemas
export const insertUserSchema = z.object({
  id: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  profileImageUrl: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertExpenseSchema = z.object({
  userId: z.string(),
  name: z.string(),
  amount: z.string(),
  category: z.string(),
  date: z.coerce.date(),
});

export const insertBudgetSchema = z.object({
  userId: z.string(),
  amount: z.string(),
  period: z.string(),
});

export const insertUserBalanceSchema = z.object({
  userId: z.string(),
  balance: z.string(),
});

// Income schema
export const insertIncomeSchema = z.object({
  userId: z.string(),
  amount: z.string(),
  source: z.string(),
  date: z.coerce.date(),
});

// User settings schema
export const insertUserSettingsSchema = z.object({
  userId: z.string(),
  budgetCycle: z.enum(['biweekly', 'monthly', 'six_months']),
  lastResetDate: z.coerce.date(),
  nextResetDate: z.coerce.date(),
  autoResetEnabled: z.number().min(0).max(1),
});

// Archive schema
export const insertArchiveSchema = z.object({
  userId: z.string(),
  periodType: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  initialBalance: z.string(),
  finalBalance: z.string(),
  totalExpenses: z.string(),
  totalIncomes: z.string(),
  netResult: z.string(),
  expenseCount: z.number(),
  incomeCount: z.number(),
});

// Archive details schema
export const insertArchiveDetailSchema = z.object({
  archiveId: z.number(),
  type: z.enum(['expense', 'income']),
  name: z.string(),
  amount: z.string(),
  category: z.string().optional(),
  source: z.string().optional(),
  originalDate: z.coerce.date(),
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Expense = typeof expenses.$inferSelect;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

export type Income = typeof incomes.$inferSelect;
export type InsertIncome = z.infer<typeof insertIncomeSchema>;

export type Budget = typeof budgets.$inferSelect;
export type InsertBudget = z.infer<typeof insertBudgetSchema>;

export type UserBalance = typeof userBalances.$inferSelect;
export type InsertUserBalance = z.infer<typeof insertUserBalanceSchema>;

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;

export type Archive = typeof archives.$inferSelect;
export type InsertArchive = z.infer<typeof insertArchiveSchema>;

export type ArchiveDetail = typeof archiveDetails.$inferSelect;
export type InsertArchiveDetail = z.infer<typeof insertArchiveDetailSchema>;
