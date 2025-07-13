/**
 * AI Assistant for BlueFlow
 * Provides smart financial suggestions and notification management
 * Float-compatible for easy migration to Float Flow
 */

export interface Suggestion {
  id: string;
  type: 'budget' | 'savings' | 'spending' | 'category' | 'general';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  icon: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  type: 'budget_alert' | 'balance_update' | 'monthly_reminder' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon: string;
}

export class AIAssistant {
  /**
   * Generate smart suggestions based on current spending data
   */
  static generateWeeklySuggestions(): Suggestion[] {
    const expenses = this.getExpenses();
    const budget = this.getBudget();
    const categoryTotals = this.getCategoryTotals(expenses);
    
    const suggestions: Suggestion[] = [];
    
    // Budget-based suggestions
    if (expenses.length > 0 && budget > 0) {
      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const budgetUsage = (totalSpent / budget) * 100;
      
      if (budgetUsage > 85) {
        suggestions.push({
          id: 'budget-warning',
          type: 'budget',
          title: 'Budget Alert',
          message: `You've used ${budgetUsage.toFixed(1)}% of your budget. Consider reducing spending this week.`,
          priority: 'high',
          icon: '⚠️',
          timestamp: new Date()
        });
      } else if (budgetUsage < 60) {
        suggestions.push({
          id: 'budget-good',
          type: 'savings',
          title: 'Great Budget Control',
          message: `You've only used ${budgetUsage.toFixed(1)}% of your budget. You're on track for savings!`,
          priority: 'medium',
          icon: '✅',
          timestamp: new Date()
        });
      }
    }
    
    // Category-based suggestions
    if (Object.keys(categoryTotals).length > 0) {
      const topCategory = Object.entries(categoryTotals)
        .sort(([, a], [, b]) => b - a)[0];
      
      if (topCategory) {
        const [category, amount] = topCategory;
        const totalSpent = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
        const categoryPercentage = (amount / totalSpent) * 100;
        
        if (categoryPercentage > 40) {
          const categoryTips = this.getCategoryTips(category);
          suggestions.push({
            id: 'category-tip',
            type: 'category',
            title: `${category} Spending Tip`,
            message: `You spent ${categoryPercentage.toFixed(1)}% of your budget on ${category}. ${categoryTips}`,
            priority: 'medium',
            icon: '💡',
            timestamp: new Date()
          });
        }
      }
    }
    
    // General tips
    const generalTips = this.getGeneralTips();
    if (generalTips.length > 0) {
      const randomTip = generalTips[Math.floor(Math.random() * generalTips.length)];
      suggestions.push({
        id: 'general-tip',
        type: 'general',
        title: 'Weekly Tip',
        message: randomTip,
        priority: 'low',
        icon: '💡',
        timestamp: new Date()
      });
    }
    
    return suggestions.slice(0, 3); // Return top 3 suggestions
  }
  
  /**
   * Get category-specific tips
   */
  private static getCategoryTips(category: string): string {
    const tips: Record<string, string[]> = {
      Food: [
        'Try meal prepping to reduce food costs.',
        'Consider eating out less frequently.',
        'Look for grocery store discounts and coupons.',
        'Cook more meals at home to save money.'
      ],
      Transport: [
        'Consider carpooling or using public transport.',
        'Try walking or biking for short distances.',
        'Look into ride-sharing apps for better rates.',
        'Plan your trips to reduce fuel costs.'
      ],
      Entertainment: [
        'Look for free local events and activities.',
        'Consider streaming services instead of movie tickets.',
        'Try home entertainment options.',
        'Look for group discounts on activities.'
      ],
      Shopping: [
        'Create a shopping list and stick to it.',
        'Compare prices before making purchases.',
        'Wait 24 hours before buying non-essential items.',
        'Look for sales and seasonal discounts.'
      ],
      Bills: [
        'Review subscriptions and cancel unused ones.',
        'Look for better rates on utilities and services.',
        'Consider bundling services for discounts.',
        'Set up automatic payments to avoid late fees.'
      ],
      Health: [
        'Look into preventive care to avoid larger costs.',
        'Consider generic medications when possible.',
        'Use health savings accounts if available.',
        'Look for community health programs.'
      ]
    };
    
    const categoryTips = tips[category] || tips.Other || [
      'Track your spending in this category more carefully.',
      'Look for ways to reduce costs in this area.',
      'Consider if all expenses in this category are necessary.'
    ];
    
    return categoryTips[Math.floor(Math.random() * categoryTips.length)];
  }
  
  /**
   * Get general financial tips
   */
  private static getGeneralTips(): string[] {
    return [
      'Save at least 20% of your income each month.',
      'Track your expenses daily to stay aware of spending habits.',
      'Create an emergency fund covering 3-6 months of expenses.',
      'Review and adjust your budget monthly.',
      'Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
      'Automate your savings to make it easier.',
      'Compare prices before making large purchases.',
      'Pay off high-interest debt first.',
      'Consider using cash for discretionary spending.',
      'Set specific financial goals and track progress.'
    ];
  }
  
  /**
   * Get recent notifications
   */
  static getRecentNotifications(): Notification[] {
    const notifications = localStorage.getItem('blueflow_notifications');
    if (!notifications) return [];
    
    try {
      const parsed = JSON.parse(notifications);
      return parsed
        .sort((a: Notification, b: Notification) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )
        .slice(0, 3);
    } catch {
      return [];
    }
  }
  
  /**
   * Add a new notification
   */
  static addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const notifications = this.getRecentNotifications();
    
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    notifications.unshift(newNotification);
    
    // Keep only last 10 notifications
    const limitedNotifications = notifications.slice(0, 10);
    
    localStorage.setItem('blueflow_notifications', JSON.stringify(limitedNotifications));
  }
  
  /**
   * Mark notification as read
   */
  static markNotificationAsRead(id: string): void {
    const notifications = this.getRecentNotifications();
    const updated = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    
    localStorage.setItem('blueflow_notifications', JSON.stringify(updated));
  }
  
  /**
   * Helper methods to get data
   */
  private static getExpenses() {
    const stored = localStorage.getItem('blueflow_expenses');
    return stored ? JSON.parse(stored) : [];
  }
  
  private static getBudget(): number {
    const stored = localStorage.getItem('blueflow_budget_amount');
    return stored ? parseFloat(stored) : 500;
  }
  
  private static getCategoryTotals(expenses: any[]): Record<string, number> {
    const totals: Record<string, number> = {};
    expenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    return totals;
  }
}