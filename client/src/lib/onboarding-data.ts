/**
 * Demo data for onboarding new users
 * Contains sample expense, income, budget, and report data
 */

export interface DemoExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: Date;
  createdAt: Date;
}

export interface DemoIncome {
  id: string;
  amount: number;
  source: string;
  date: Date;
  createdAt: Date;
}

export interface DemoBudget {
  period: 'monthly' | 'biweekly' | 'six_months';
  amount: number;
}

export class OnboardingDataManager {
  private static readonly DEMO_FLAG_KEY = 'blueflow-demo-data-active';
  private static readonly DEMO_EXPENSES_KEY = 'blueflow-demo-expenses';
  private static readonly DEMO_INCOMES_KEY = 'blueflow-demo-incomes';
  private static readonly DEMO_BUDGET_KEY = 'blueflow-demo-budget';
  private static readonly DEMO_BALANCE_KEY = 'blueflow-demo-balance';

  /**
   * Load demo data for new user onboarding
   */
  static loadDemoData(): void {
    const currentDate = new Date();
    const lastWeek = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Demo expense
    const demoExpenses: DemoExpense[] = [
      {
        id: 'demo-expense-1',
        name: 'Coffee Shop',
        amount: 12.50,
        category: 'Food & Dining',
        date: lastWeek,
        createdAt: lastWeek
      }
    ];

    // Demo income
    const demoIncomes: DemoIncome[] = [
      {
        id: 'demo-income-1',
        amount: 2500.00,
        source: 'Salary',
        date: lastWeek,
        createdAt: lastWeek
      }
    ];

    // Demo budget
    const demoBudget: DemoBudget = {
      period: 'monthly',
      amount: 1000
    };

    // Demo balance
    const demoBalance = 2487.50; // Salary - Coffee expense

    // Store demo data
    localStorage.setItem(this.DEMO_FLAG_KEY, 'true');
    localStorage.setItem(this.DEMO_EXPENSES_KEY, JSON.stringify(demoExpenses));
    localStorage.setItem(this.DEMO_INCOMES_KEY, JSON.stringify(demoIncomes));
    localStorage.setItem(this.DEMO_BUDGET_KEY, JSON.stringify(demoBudget));
    localStorage.setItem(this.DEMO_BALANCE_KEY, demoBalance.toString());

    // Also merge with existing expenses/incomes if any
    const existingExpenses = JSON.parse(localStorage.getItem('blueflow-expenses') || '[]');
    const existingIncomes = JSON.parse(localStorage.getItem('blueflow-incomes') || '[]');
    
    localStorage.setItem('blueflow-expenses', JSON.stringify([...existingExpenses, ...demoExpenses]));
    localStorage.setItem('blueflow-incomes', JSON.stringify([...existingIncomes, ...demoIncomes]));
    
    // Set budget and balance
    localStorage.setItem('blueflow-budget', JSON.stringify(demoBudget));
    localStorage.setItem('blueflow-balance', demoBalance.toString());
  }

  /**
   * Clear demo data after onboarding completion
   */
  static clearDemoData(): void {
    // Remove demo flag
    localStorage.removeItem(this.DEMO_FLAG_KEY);
    localStorage.removeItem(this.DEMO_EXPENSES_KEY);
    localStorage.removeItem(this.DEMO_INCOMES_KEY);
    localStorage.removeItem(this.DEMO_BUDGET_KEY);
    localStorage.removeItem(this.DEMO_BALANCE_KEY);

    // Remove demo items from main storage
    const expenses = JSON.parse(localStorage.getItem('blueflow-expenses') || '[]');
    const incomes = JSON.parse(localStorage.getItem('blueflow-incomes') || '[]');

    const filteredExpenses = expenses.filter((expense: any) => !expense.id.startsWith('demo-'));
    const filteredIncomes = incomes.filter((income: any) => !income.id.startsWith('demo-'));

    localStorage.setItem('blueflow-expenses', JSON.stringify(filteredExpenses));
    localStorage.setItem('blueflow-incomes', JSON.stringify(filteredIncomes));

    // Reset budget and balance to defaults
    localStorage.setItem('blueflow-budget', JSON.stringify({ period: 'monthly', amount: 1000 }));
    localStorage.setItem('blueflow-balance', '0');
  }

  /**
   * Check if demo data is currently active
   */
  static isDemoDataActive(): boolean {
    return localStorage.getItem(this.DEMO_FLAG_KEY) === 'true';
  }

  /**
   * Get demo expenses
   */
  static getDemoExpenses(): DemoExpense[] {
    const data = localStorage.getItem(this.DEMO_EXPENSES_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.map((exp: any) => ({
      ...exp,
      date: new Date(exp.date),
      createdAt: new Date(exp.createdAt)
    }));
  }

  /**
   * Get demo incomes
   */
  static getDemoIncomes(): DemoIncome[] {
    const data = localStorage.getItem(this.DEMO_INCOMES_KEY);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.map((inc: any) => ({
      ...inc,
      date: new Date(inc.date),
      createdAt: new Date(inc.createdAt)
    }));
  }

  /**
   * Get demo budget
   */
  static getDemoBudget(): DemoBudget | null {
    const data = localStorage.getItem(this.DEMO_BUDGET_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Get demo balance
   */
  static getDemoBalance(): number {
    const data = localStorage.getItem(this.DEMO_BALANCE_KEY);
    return data ? parseFloat(data) : 0;
  }
}