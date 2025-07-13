/**
 * Notification System for BlueFlow
 * Handles budget alerts, smart suggestions, and reminders
 * Float-compatible for easy migration to Float Flow
 */

export type NotificationType = 'budget_exceeded' | 'balance_reminder' | 'month_end' | 'smart_tip';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

export interface SmartTip {
  id: string;
  message: string;
  category: string;
  timestamp: Date;
  condition: string; // For debugging - what triggered this tip
}

const STORAGE_KEY = 'blueflow_notifications';
const TIPS_STORAGE_KEY = 'blueflow_smart_tips';

/**
 * Notification Manager
 * Handles creation, storage, and retrieval of notifications
 */
export class NotificationManager {
  static getNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const notifications = JSON.parse(stored);
      return notifications.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
      }));
    } catch {
      return [];
    }
  }

  static addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      timestamp: new Date(),
      read: false,
    };

    const notifications = this.getNotifications();
    notifications.unshift(newNotification);
    
    // Keep only last 50 notifications
    const trimmed = notifications.slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return newNotification;
  }

  static markAsRead(id: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }
  }

  static getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.read).length;
  }

  static getRecentNotifications(limit: number = 3): Notification[] {
    return this.getNotifications().slice(0, limit);
  }

  private static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

/**
 * Smart Tips Generator
 * Generates AI-like financial suggestions based on spending patterns
 */
export class SmartTipsGenerator {
  static getSmartTips(): SmartTip[] {
    try {
      const stored = localStorage.getItem(TIPS_STORAGE_KEY);
      if (!stored) return [];
      
      const tips = JSON.parse(stored);
      return tips.map((t: any) => ({
        ...t,
        timestamp: new Date(t.timestamp),
      }));
    } catch {
      return [];
    }
  }

  static addTip(tip: Omit<SmartTip, 'id' | 'timestamp'>): SmartTip {
    const newTip: SmartTip = {
      ...tip,
      id: NotificationManager['generateId'](),
      timestamp: new Date(),
    };

    const tips = this.getSmartTips();
    tips.unshift(newTip);
    
    // Keep only last 20 tips
    const trimmed = tips.slice(0, 20);
    
    localStorage.setItem(TIPS_STORAGE_KEY, JSON.stringify(trimmed));
    return newTip;
  }

  static getLatestTip(): SmartTip | null {
    const tips = this.getSmartTips();
    return tips.length > 0 ? tips[0] : null;
  }

  /**
   * Generate smart tips based on spending data
   * Mock conditions for now - will be replaced with real analytics
   */
  static generateTipsFromSpendingData(expenses: any[], categoryTotals: Record<string, number>, budget: any): void {
    if (expenses.length === 0) return;

    const totalSpent = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
    
    // Tip 1: Category-based suggestions
    const topCategory = Object.entries(categoryTotals).reduce((top, [category, amount]) => 
      amount > top.amount ? { category, amount } : top, 
      { category: '', amount: 0 }
    );

    if (topCategory.amount > 0) {
      const percentage = ((topCategory.amount / totalSpent) * 100).toFixed(0);
      
      if (parseFloat(percentage) > 40) {
        const suggestions = {
          'Food & Dining': "Try cooking at home 2-3 times this week to save money",
          'Transportation': "Consider walking or biking for short trips to reduce costs",
          'Shopping': "Create a shopping list before going out to avoid impulse purchases",
          'Entertainment': "Look for free events in your area or have movie nights at home",
          'Health & Fitness': "Consider home workouts or outdoor activities instead of gym fees",
        };

        const suggestion = suggestions[topCategory.category as keyof typeof suggestions] || 
                          "Consider reducing expenses in this category";

        this.addTip({
          message: `You spent ${percentage}% on '${topCategory.category}' this week. ${suggestion}.`,
          category: topCategory.category,
          condition: `Category ${topCategory.category} > 40% of total spending`,
        });
      }
    }

    // Tip 2: Budget comparison
    if (budget) {
      const budgetUsage = (totalSpent / budget.amount) * 100;
      
      if (budgetUsage < 70) {
        this.addTip({
          message: `Great job! You're only using ${budgetUsage.toFixed(0)}% of your budget. Consider saving the extra.`,
          category: 'budgeting',
          condition: `Budget usage < 70%`,
        });
      } else if (budgetUsage > 90) {
        this.addTip({
          message: `You're at ${budgetUsage.toFixed(0)}% of your budget. Focus on essentials for the rest of this period.`,
          category: 'budgeting',
          condition: `Budget usage > 90%`,
        });
      }
    }

    // Tip 3: Spending frequency
    const today = new Date();
    const recentExpenses = expenses.filter((expense: any) => {
      const expenseDate = new Date(expense.date);
      const daysDiff = (today.getTime() - expenseDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 3;
    });

    if (recentExpenses.length > 5) {
      this.addTip({
        message: `You've made ${recentExpenses.length} purchases in the last 3 days. Consider a 24-hour rule before buying non-essentials.`,
        category: 'spending_habits',
        condition: `>5 purchases in last 3 days`,
      });
    }

    // Tip 4: Monthly comparison (mock)
    const currentMonth = today.getMonth();
    const isFirstWeek = today.getDate() <= 7;
    
    if (isFirstWeek && Math.random() > 0.7) {
      this.addTip({
        message: `Based on last month's data, you tend to overspend on weekends. Plan your weekend budget in advance.`,
        category: 'planning',
        condition: `First week of month + random trigger`,
      });
    }
  }
}

/**
 * Budget Alert System
 * Monitors budget usage and triggers notifications
 */
export class BudgetAlertSystem {
  static checkBudgetStatus(expenses: any[], budget: any): void {
    if (!budget) return;

    const totalSpent = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
    const budgetUsage = (totalSpent / budget.amount) * 100;

    // Budget exceeded
    if (totalSpent > budget.amount) {
      NotificationManager.addNotification({
        type: 'budget_exceeded',
        title: 'Budget Exceeded',
        message: '⚠️ You\'ve exceeded your set budget. Consider reducing expenses this week.',
        priority: 'high',
        icon: '⚠️',
      });
    }
    // Budget warning at 85%
    else if (budgetUsage >= 85 && budgetUsage < 100) {
      NotificationManager.addNotification({
        type: 'budget_exceeded',
        title: 'Budget Warning',
        message: `💰 You've used ${budgetUsage.toFixed(0)}% of your ${budget.period} budget. Be mindful of remaining expenses.`,
        priority: 'medium',
        icon: '💰',
      });
    }
  }

  static checkBalanceReminder(): void {
    const lastUpdate = localStorage.getItem('last_balance_update');
    const now = new Date();
    
    if (!lastUpdate) {
      localStorage.setItem('last_balance_update', now.toISOString());
      return;
    }

    const lastUpdateDate = new Date(lastUpdate);
    const daysSinceUpdate = (now.getTime() - lastUpdateDate.getTime()) / (1000 * 60 * 60 * 24);

    // Remind every 3 days
    if (daysSinceUpdate >= 3) {
      NotificationManager.addNotification({
        type: 'balance_reminder',
        title: 'Update Balance',
        message: '💡 Don\'t forget to update your account balance for accurate tracking.',
        priority: 'medium',
        icon: '💡',
      });
      
      localStorage.setItem('last_balance_update', now.toISOString());
    }
  }

  static checkMonthEnd(): void {
    const now = new Date();
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    // Check if it's the last 3 days of the month
    if (now.getDate() >= lastDayOfMonth - 2) {
      const lastMonthEndNotification = localStorage.getItem('last_month_end_notification');
      const currentMonth = `${now.getFullYear()}-${now.getMonth()}`;
      
      if (lastMonthEndNotification !== currentMonth) {
        NotificationManager.addNotification({
          type: 'month_end',
          title: 'Month End Review',
          message: '📅 Review your monthly spending and save your report.',
          priority: 'medium',
          icon: '📅',
        });
        
        localStorage.setItem('last_month_end_notification', currentMonth);
      }
    }
  }
}

/**
 * Main Notification System Controller
 * Coordinates all notification types and triggers
 */
export class NotificationSystem {
  static initialize(): void {
    // Set up periodic checks
    this.runPeriodicChecks();
    
    // Set up interval for background checks (every 5 minutes)
    setInterval(() => {
      this.runPeriodicChecks();
    }, 5 * 60 * 1000);
  }

  static runPeriodicChecks(): void {
    BudgetAlertSystem.checkBalanceReminder();
    BudgetAlertSystem.checkMonthEnd();
  }

  static checkBudgetAndGenerateTips(expenses: any[], budget: any, categoryTotals: Record<string, number>): void {
    BudgetAlertSystem.checkBudgetStatus(expenses, budget);
    SmartTipsGenerator.generateTipsFromSpendingData(expenses, categoryTotals, budget);
  }

  static getNotificationSummary() {
    return {
      unreadCount: NotificationManager.getUnreadCount(),
      recentNotifications: NotificationManager.getRecentNotifications(3),
      latestTip: SmartTipsGenerator.getLatestTip(),
    };
  }
}