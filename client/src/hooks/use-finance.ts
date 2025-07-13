// React hooks for BlueFlow finance management
// Float-compatible: Clean separation between logic and UI state

import { useState, useEffect, useCallback } from 'react';
import { 
  FinanceStore, 
  BudgetPeriod, 
  Expense, 
  BudgetSettings,
  MonthlyArchive 
} from '@/lib/finance-store';

/**
 * Balance Management Hook
 * Provides reactive balance state with update functions
 */
export function useBalance() {
  const [balance, setBalanceState] = useState<number>(0);

  useEffect(() => {
    setBalanceState(FinanceStore.getBalance());
  }, []);

  const updateBalance = useCallback((newBalance: number) => {
    FinanceStore.setBalance(newBalance);
    setBalanceState(newBalance);
  }, []);

  const adjustBalance = useCallback((delta: number) => {
    const newBalance = FinanceStore.updateBalance(delta);
    setBalanceState(newBalance);
    return newBalance;
  }, []);

  return {
    balance,
    updateBalance,
    adjustBalance
  };
}

/**
 * Budget Management Hook
 * Handles budget settings and progress tracking
 */
export function useBudget() {
  const [budget, setBudgetState] = useState<BudgetSettings | null>(null);
  const [progress, setProgress] = useState({
    spent: 0,
    total: 0,
    percentage: 0,
    remaining: 0
  });

  const refreshBudgetData = useCallback(() => {
    const currentBudget = FinanceStore.getBudget();
    const currentProgress = FinanceStore.getBudgetProgress();
    
    setBudgetState(currentBudget);
    setProgress(currentProgress);
  }, []);

  // Load budget data from localStorage and recalculate remaining budget
  useEffect(() => {
    const loadBudgetFromStorage = () => {
      try {
        // Load budget settings
        const storedBudget = localStorage.getItem('blueflow_budget');
        if (storedBudget) {
          const budgetData = JSON.parse(storedBudget);
          setBudgetState({
            ...budgetData,
            startDate: new Date(budgetData.startDate)
          });
        }

        // Load expenses and recalculate budget progress
        const storedExpenses = localStorage.getItem('blueflow_expenses');
        if (storedExpenses && storedBudget) {
          const expenseData = JSON.parse(storedExpenses);
          const budgetData = JSON.parse(storedBudget);
          
          // Calculate total spent
          const totalSpent = expenseData.reduce((sum: number, expense: any) => sum + expense.amount, 0);
          const remaining = budgetData.amount - totalSpent;
          const percentage = budgetData.amount > 0 ? (totalSpent / budgetData.amount) * 100 : 0;
          
          setProgress({
            spent: totalSpent,
            total: budgetData.amount,
            percentage: Math.min(percentage, 100),
            remaining: remaining
          });
        }
      } catch (error) {
        console.error('Failed to load budget from localStorage:', error);
      }
    };

    loadBudgetFromStorage();
    refreshBudgetData();
  }, [refreshBudgetData]);

  const setBudget = useCallback((period: BudgetPeriod, amount: number) => {
    const newBudget = FinanceStore.setBudget(period, amount);
    setBudgetState(newBudget);
    refreshBudgetData();
    return newBudget;
  }, [refreshBudgetData]);

  const getRemainingBudget = useCallback(() => {
    return FinanceStore.getRemainingBudget();
  }, []);

  return {
    budget,
    progress,
    setBudget,
    getRemainingBudget,
    refreshBudgetData
  };
}

/**
 * Expense Management Hook
 * Handles expense creation, deletion, and categorization
 */
export function useExpenses() {
  const [expenses, setExpensesState] = useState<Expense[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});

  const refreshExpenses = useCallback(() => {
    const currentExpenses = FinanceStore.getExpenses();
    const totals = FinanceStore.getCategoryTotals();
    
    setExpensesState(currentExpenses);
    setCategoryTotals(totals);
  }, []);

  // 3. Auto-reload data on refresh - Load from localStorage on component mount
  useEffect(() => {
    const loadExpensesFromStorage = () => {
      try {
        const storedExpenses = localStorage.getItem('blueflow_expenses');
        if (storedExpenses) {
          const expenseData = JSON.parse(storedExpenses);
          // Convert date strings back to Date objects
          const processedExpenses = expenseData.map((expense: any) => ({
            ...expense,
            date: new Date(expense.date),
            createdAt: new Date(expense.createdAt)
          }));
          setExpensesState(processedExpenses);
          
          // Calculate category totals
          const totals: Record<string, number> = {};
          processedExpenses.forEach((expense: Expense) => {
            totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
          });
          setCategoryTotals(totals);
        }
      } catch (error) {
        console.error('Failed to load expenses from localStorage:', error);
      }
    };

    loadExpensesFromStorage();
    refreshExpenses();
  }, [refreshExpenses]);

  const addExpense = useCallback((
    name: string, 
    amount: number, 
    category: string, 
    date?: Date
  ) => {
    const newExpense = FinanceStore.addExpense(name, amount, category, date);
    refreshExpenses();
    return newExpense;
  }, [refreshExpenses]);

  const removeExpense = useCallback((id: string) => {
    const success = FinanceStore.removeExpense(id);
    if (success) {
      refreshExpenses();
    }
    return success;
  }, [refreshExpenses]);

  const getExpensesByCategory = useCallback((category: string) => {
    return expenses.filter(expense => expense.category === category);
  }, [expenses]);

  const getExpensesByDateRange = useCallback((startDate: Date, endDate: Date) => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  }, [expenses]);

  return {
    expenses,
    categoryTotals,
    addExpense,
    removeExpense,
    refreshExpenses,
    getExpensesByCategory,
    getExpensesByDateRange
  };
}

/**
 * Archive Management Hook
 * Handles monthly data archiving and historical comparisons
 */
export function useArchive() {
  const [archive, setArchiveState] = useState<MonthlyArchive[]>([]);
  const [monthlyComparison, setMonthlyComparison] = useState({
    current: 0,
    previous: 0,
    change: 0
  });

  const refreshArchive = useCallback(() => {
    const currentArchive = FinanceStore.getArchive();
    const comparison = FinanceStore.getMonthlyComparison();
    
    setArchiveState(currentArchive);
    setMonthlyComparison(comparison);
  }, []);

  useEffect(() => {
    refreshArchive();
  }, [refreshArchive]);

  const saveCurrentMonth = useCallback(() => {
    const archive = FinanceStore.saveCurrentMonth();
    refreshArchive();
    return archive;
  }, [refreshArchive]);

  const getArchiveByMonth = useCallback((month: string) => {
    return archive.find(a => a.month === month);
  }, [archive]);

  return {
    archive,
    monthlyComparison,
    saveCurrentMonth,
    refreshArchive,
    getArchiveByMonth
  };
}

/**
 * Combined Finance Hook
 * Provides all finance functionality in one hook
 */
export function useFinance() {
  const balance = useBalance();
  const budget = useBudget();
  const expenses = useExpenses();
  const archive = useArchive();

  // Refresh all data
  const refreshAll = useCallback(() => {
    budget.refreshBudgetData();
    expenses.refreshExpenses();
    archive.refreshArchive();
  }, [budget, expenses, archive]);

  // Add expense and update budget progress
  const addExpenseWithBudgetUpdate = useCallback((
    name: string,
    amount: number,
    category: string,
    date?: Date
  ) => {
    const expense = expenses.addExpense(name, amount, category, date);
    budget.refreshBudgetData(); // Update budget progress after expense
    return expense;
  }, [expenses, budget]);

  // Reset all financial data
  const resetAllData = useCallback(() => {
    FinanceStore.resetAllData();
    refreshAll();
  }, [refreshAll]);

  return {
    ...balance,
    ...budget,
    ...expenses,
    ...archive,
    addExpenseWithBudgetUpdate,
    refreshAll,
    resetAllData
  };
}

/**
 * Finance Statistics Hook
 * Provides computed statistics and insights
 */
export function useFinanceStats() {
  const { expenses, budget } = useFinance();

  const getTopCategories = useCallback((limit: number = 5) => {
    const categoryTotals = FinanceStore.getCategoryTotals();
    return Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([category, amount]) => ({ category, amount }));
  }, []);

  const getWeeklyTrend = useCallback(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeek = expenses.filter(expense => 
      new Date(expense.date) >= oneWeekAgo
    ).reduce((sum, expense) => sum + expense.amount, 0);

    const lastWeek = expenses.filter(expense => {
      const date = new Date(expense.date);
      return date >= twoWeeksAgo && date < oneWeekAgo;
    }).reduce((sum, expense) => sum + expense.amount, 0);

    const change = lastWeek > 0 ? ((thisWeek - lastWeek) / lastWeek) * 100 : 0;

    return { thisWeek, lastWeek, change };
  }, [expenses]);

  const getDailyAverage = useCallback((days: number = 30) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentExpenses = expenses.filter(expense => 
      new Date(expense.date) >= cutoffDate
    );

    const total = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return total / days;
  }, [expenses]);

  const getBudgetHealth = useCallback(() => {
    if (!budget || !budget.progress) return 'unknown';
    
    const { percentage } = budget.progress;
    
    if (percentage <= 60) return 'healthy';
    if (percentage <= 85) return 'warning';
    return 'critical';
  }, [budget]);

  return {
    getTopCategories,
    getWeeklyTrend,
    getDailyAverage,
    getBudgetHealth
  };
}