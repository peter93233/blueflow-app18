/**
 * Notification Hook for BlueFlow
 * Manages toast notifications and integrates with the finance system
 */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { NotificationService, type Notification } from '@/lib/notification-service';

export function useNotifications() {
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);

  const showToast = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    NotificationService.addNotification(notification);
    const newNotification: Notification = {
      ...notification,
      id: `toast_${Date.now()}`,
      timestamp: new Date()
    };
    
    setActiveToasts(prev => [...prev, newNotification]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(toast => toast.id !== newNotification.id));
    }, 5000);
    
    return newNotification;
  };

  const dismissToast = (id: string) => {
    setActiveToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const triggerBudgetCheck = (expenses: any[], budget: any, categoryTotals: Record<string, number>) => {
    // Calculate current spending
    const currentSpending = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const weeklyBudget = budget?.amount || 500;
    
    // Run notification checks
    NotificationService.checkBudgetAlerts(currentSpending, weeklyBudget);
    NotificationService.generateSpendingTips(categoryTotals);
  };

  return {
    activeToasts,
    showToast,
    dismissToast,
    triggerBudgetCheck
  };
}

interface NotificationContextType {
  activeToasts: Notification[];
  showToast: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Notification;
  dismissToast: (id: string) => void;
  triggerBudgetCheck: (expenses: any[], budget: any, categoryTotals: Record<string, number>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notificationUtils = useNotifications();

  // Generate initial notifications on app start
  useEffect(() => {
    const hasInitialNotifications = localStorage.getItem('blueflow_notifications');
    if (!hasInitialNotifications) {
      // Generate some initial notifications for demo
      NotificationService.runWeeklyAnalysis();
    }
  }, []);

  const contextValue: NotificationContextType = {
    activeToasts: notificationUtils.activeToasts,
    showToast: notificationUtils.showToast,
    dismissToast: notificationUtils.dismissToast,
    triggerBudgetCheck: notificationUtils.triggerBudgetCheck
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}