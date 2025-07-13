/**
 * Weekly Notification Service for BlueFlow
 * Handles budget alerts, spending tips, and trend notifications
 */

export interface Notification {
  id: string;
  type: 'budget_alert' | 'savings_tip' | 'spending_trend' | 'achievement';
  title: string;
  message: string;
  icon: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high';
}

export class NotificationService {
  private static readonly STORAGE_KEY = 'blueflow_notifications';
  private static readonly MAX_NOTIFICATIONS = 3;

  /**
   * Get stored notifications from localStorage
   */
  static getNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const notifications = JSON.parse(stored);
      return notifications.map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
    } catch (error) {
      console.error('Error loading notifications:', error);
      return [];
    }
  }

  /**
   * Add a new notification
   */
  static addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    const notifications = this.getNotifications();
    notifications.unshift(newNotification);
    
    // Keep only the last 3 notifications
    const trimmedNotifications = notifications.slice(0, this.MAX_NOTIFICATIONS);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedNotifications));
  }

  /**
   * Clear all notifications
   */
  static clearNotifications(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Generate budget-based notifications
   */
  static checkBudgetAlerts(currentSpending: number, weeklyBudget: number): void {
    const spentPercentage = (currentSpending / weeklyBudget) * 100;
    
    if (spentPercentage >= 85) {
      this.addNotification({
        type: 'budget_alert',
        title: 'Budget Alert',
        message: `⚠️ You've spent ${spentPercentage.toFixed(0)}% of your weekly budget`,
        icon: '⚠️',
        priority: 'high'
      });
    } else if (spentPercentage >= 70) {
      this.addNotification({
        type: 'budget_alert',
        title: 'Budget Warning',
        message: `💡 You've used ${spentPercentage.toFixed(0)}% of your weekly budget. Consider tracking remaining expenses`,
        icon: '💡',
        priority: 'medium'
      });
    }
  }

  /**
   * Generate savings achievements
   */
  static checkSavingsAchievements(thisWeekSpending: number, lastWeekSpending: number): void {
    const savings = lastWeekSpending - thisWeekSpending;
    
    if (savings > 0) {
      this.addNotification({
        type: 'achievement',
        title: 'Great Job!',
        message: `✅ You've saved $${savings.toFixed(2)} compared to last week!`,
        icon: '✅',
        priority: 'medium'
      });
    }
  }

  /**
   * Generate spending category tips
   */
  static generateSpendingTips(categoryTotals: Record<string, number>): void {
    const tips = [
      {
        category: 'Food',
        threshold: 200,
        message: '💡 Tip: Try cooking twice this week to reduce food expenses'
      },
      {
        category: 'Transportation',
        threshold: 100,
        message: '🚗 Consider carpooling or using public transit to save on transportation'
      },
      {
        category: 'Entertainment',
        threshold: 150,
        message: '🎬 Look for free local events or movie nights at home this week'
      },
      {
        category: 'Shopping',
        threshold: 300,
        message: '🛒 Create a shopping list and stick to it to avoid impulse purchases'
      }
    ];

    tips.forEach(tip => {
      if (categoryTotals[tip.category] && categoryTotals[tip.category] > tip.threshold) {
        this.addNotification({
          type: 'savings_tip',
          title: 'Smart Spending Tip',
          message: tip.message,
          icon: '💡',
          priority: 'low'
        });
      }
    });
  }

  /**
   * Generate weekly trend notifications
   */
  static generateWeeklyTrends(): void {
    const trends = [
      {
        message: '📊 Your spending is 15% lower than average this week',
        icon: '📊',
        priority: 'medium' as const
      },
      {
        message: '🎯 You\'re on track to meet your monthly savings goal',
        icon: '🎯',
        priority: 'medium' as const
      },
      {
        message: '⭐ Your budgeting consistency has improved by 20%',
        icon: '⭐',
        priority: 'low' as const
      }
    ];

    // Randomly show one trend notification (simulate weekly analysis)
    const randomTrend = trends[Math.floor(Math.random() * trends.length)];
    
    this.addNotification({
      type: 'spending_trend',
      title: 'Weekly Insight',
      message: randomTrend.message,
      icon: randomTrend.icon,
      priority: randomTrend.priority
    });
  }

  /**
   * Generate current AI tip
   */
  static getCurrentTip(): string {
    const tips = [
      '💡 Set up automatic transfers to your savings account',
      '🎯 Review your subscriptions monthly to avoid unused services',
      '📱 Use the 24-hour rule before making non-essential purchases',
      '🍳 Meal planning can reduce food expenses by up to 30%',
      '💰 Consider the 50/30/20 rule: 50% needs, 30% wants, 20% savings',
      '📊 Track your expenses weekly to stay on budget',
      '🏦 Look for high-yield savings accounts to grow your money'
    ];

    return tips[Math.floor(Math.random() * tips.length)];
  }

  /**
   * Run all notification checks (simulate weekly analysis)
   */
  static runWeeklyAnalysis(): void {
    // Simulate current spending data
    const currentSpending = 420; // $420 spent this week
    const weeklyBudget = 500;     // $500 weekly budget
    const lastWeekSpending = 475; // $475 spent last week
    
    const categoryTotals = {
      'Food': 180,
      'Transportation': 85,
      'Entertainment': 90,
      'Shopping': 65
    };

    // Run all checks
    this.checkBudgetAlerts(currentSpending, weeklyBudget);
    this.checkSavingsAchievements(currentSpending, lastWeekSpending);
    this.generateSpendingTips(categoryTotals);
    this.generateWeeklyTrends();
  }
}