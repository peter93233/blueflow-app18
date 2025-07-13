// Finance Store - Core logic for BlueFlow financial management
// Modular design for easy migration to Float Flow system

export type BudgetPeriod = 'weekly' | 'biweekly' | 'monthly';

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: Date;
  createdAt: Date;
}

export interface BudgetSettings {
  period: BudgetPeriod;
  amount: number;
  startDate: Date;
}

export interface FinanceState {
  balance: number;
  budget: BudgetSettings | null;
  expenses: Expense[];
  monthlyArchive: MonthlyArchive[];
}

export interface MonthlyArchive {
  month: string; // Format: "2025-01"
  totalExpenses: number;
  budgetAmount: number;
  expenseCount: number;
  categories: Record<string, number>;
  savedAt: Date;
}

// Storage keys for localStorage
const STORAGE_KEYS = {
  BALANCE: 'blueflow_balance',
  BUDGET: 'blueflow_budget',
  EXPENSES: 'blueflow_expenses',
  ARCHIVE: 'blueflow_monthly_archive'
};

// Default expense categories
export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Shopping',
  'Beauty & Personal Care',
  'Transportation',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Other'
];

/**
 * Balance Management
 * Float-compatible: Can be wrapped in any UI component
 */
export class BalanceManager {
  static getBalance(): number {
    const stored = localStorage.getItem(STORAGE_KEYS.BALANCE);
    return stored ? parseFloat(stored) : 0;
  }

  static setBalance(amount: number): void {
    localStorage.setItem(STORAGE_KEYS.BALANCE, amount.toString());
  }

  static updateBalance(delta: number): number {
    const current = this.getBalance();
    const newBalance = current + delta;
    this.setBalance(newBalance);
    return newBalance;
  }
}

/**
 * Budget Management System
 * Supports weekly, biweekly, and monthly budget cycles
 */
export class BudgetManager {
  static getBudget(): BudgetSettings | null {
    const stored = localStorage.getItem(STORAGE_KEYS.BUDGET);
    if (!stored) return null;
    
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      startDate: new Date(parsed.startDate)
    };
  }

  static setBudget(period: BudgetPeriod, amount: number): BudgetSettings {
    const budget: BudgetSettings = {
      period,
      amount,
      startDate: new Date()
    };
    
    localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budget));
    return budget;
  }

  static getCurrentPeriodExpenses(): number {
    const budget = this.getBudget();
    if (!budget) return 0;

    const expenses = ExpenseManager.getExpenses();
    const periodStart = this.getPeriodStartDate(budget);
    
    return expenses
      .filter(expense => new Date(expense.date) >= periodStart)
      .reduce((sum, expense) => sum + expense.amount, 0);
  }

  static getRemainingBudget(): number {
    const budget = this.getBudget();
    if (!budget) return 0;
    
    const spent = this.getCurrentPeriodExpenses();
    return Math.max(0, budget.amount - spent);
  }

  static getBudgetProgress(): { spent: number; total: number; percentage: number; remaining: number } {
    const budget = this.getBudget();
    if (!budget) return { spent: 0, total: 0, percentage: 0, remaining: 0 };

    const spent = this.getCurrentPeriodExpenses();
    const total = budget.amount;
    const percentage = total > 0 ? Math.round((spent / total) * 100) : 0;
    const remaining = Math.max(0, total - spent);

    return { spent, total, percentage, remaining };
  }

  private static getPeriodStartDate(budget: BudgetSettings): Date {
    const now = new Date();
    const startDate = new Date(budget.startDate);
    
    switch (budget.period) {
      case 'weekly':
        // Find the most recent Monday
        const daysFromMonday = (now.getDay() + 6) % 7;
        return new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysFromMonday);
      
      case 'biweekly':
        // Calculate 14-day periods from start date
        const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const periodsSinceStart = Math.floor(daysSinceStart / 14);
        return new Date(startDate.getTime() + (periodsSinceStart * 14 * 24 * 60 * 60 * 1000));
      
      case 'monthly':
        // Start of current month
        return new Date(now.getFullYear(), now.getMonth(), 1);
      
      default:
        return startDate;
    }
  }
}

/**
 * Expense Management
 * Handles adding, retrieving, and categorizing expenses
 */
export class ExpenseManager {
  static getExpenses(): Expense[] {
    const stored = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((expense: any) => ({
      ...expense,
      date: new Date(expense.date),
      createdAt: new Date(expense.createdAt)
    }));
  }

  static addExpense(name: string, amount: number, category: string, date: Date = new Date()): Expense {
    const expenses = this.getExpenses();
    
    const newExpense: Expense = {
      id: this.generateId(),
      name,
      amount,
      category,
      date,
      createdAt: new Date()
    };

    expenses.push(newExpense);
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    
    return newExpense;
  }

  static removeExpense(id: string): boolean {
    const expenses = this.getExpenses();
    const filteredExpenses = expenses.filter(expense => expense.id !== id);
    
    if (filteredExpenses.length === expenses.length) return false;
    
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filteredExpenses));
    return true;
  }

  static getCategoryTotals(): Record<string, number> {
    const expenses = this.getExpenses();
    const totals: Record<string, number> = {};
    
    expenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    
    return totals;
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

/**
 * Monthly Archive System
 * Saves and manages historical financial data
 */
export class ArchiveManager {
  static getArchive(): MonthlyArchive[] {
    const stored = localStorage.getItem(STORAGE_KEYS.ARCHIVE);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((archive: any) => ({
      ...archive,
      savedAt: new Date(archive.savedAt)
    }));
  }

  static saveCurrentMonth(): MonthlyArchive {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const expenses = ExpenseManager.getExpenses();
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === now.getFullYear() && 
             expenseDate.getMonth() === now.getMonth();
    });

    const totalExpenses = monthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categories = ExpenseManager.getCategoryTotals();
    const budget = BudgetManager.getBudget();

    const archive: MonthlyArchive = {
      month: monthKey,
      totalExpenses,
      budgetAmount: budget?.amount || 0,
      expenseCount: monthExpenses.length,
      categories,
      savedAt: new Date()
    };

    const existingArchive = this.getArchive();
    const filteredArchive = existingArchive.filter(a => a.month !== monthKey);
    filteredArchive.push(archive);

    localStorage.setItem(STORAGE_KEYS.ARCHIVE, JSON.stringify(filteredArchive));
    return archive;
  }

  static getMonthlyComparison(): { current: number; previous: number; change: number } {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    const previousMonth = now.getMonth() === 0 
      ? `${now.getFullYear() - 1}-12`
      : `${now.getFullYear()}-${now.getMonth().toString().padStart(2, '0')}`;

    const archive = this.getArchive();
    const current = archive.find(a => a.month === currentMonth)?.totalExpenses || 0;
    const previous = archive.find(a => a.month === previousMonth)?.totalExpenses || 0;
    
    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;

    return { current, previous, change };
  }
}

/**
 * Main Finance Store
 * Coordinates all financial operations
 */
export class FinanceStore {
  // Balance operations
  static getBalance = BalanceManager.getBalance;
  static setBalance = BalanceManager.setBalance;
  static updateBalance = BalanceManager.updateBalance;

  // Budget operations
  static getBudget = BudgetManager.getBudget;
  static setBudget = BudgetManager.setBudget;
  static getBudgetProgress = BudgetManager.getBudgetProgress;
  static getRemainingBudget = BudgetManager.getRemainingBudget;

  // Expense operations
  static getExpenses = ExpenseManager.getExpenses;
  static addExpense = ExpenseManager.addExpense;
  static removeExpense = ExpenseManager.removeExpense;
  static getCategoryTotals = ExpenseManager.getCategoryTotals;

  // Archive operations
  static getArchive = ArchiveManager.getArchive;
  static saveCurrentMonth = ArchiveManager.saveCurrentMonth;
  static getMonthlyComparison = ArchiveManager.getMonthlyComparison;

  // Convenience methods
  static getFinanceState(): FinanceState {
    return {
      balance: this.getBalance(),
      budget: this.getBudget(),
      expenses: this.getExpenses(),
      monthlyArchive: this.getArchive()
    };
  }

  static resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}