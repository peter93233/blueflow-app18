/**
 * Notification Hook for BlueFlow
 * Manages toast notifications and integrates with the finance system
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { 
  Notification, 
  NotificationManager, 
  NotificationSystem,
  SmartTipsGenerator,
  BudgetAlertSystem 
} from "@/lib/notification-system";

export function useNotifications() {
  const [activeToasts, setActiveToasts] = useState<Notification[]>([]);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load existing notifications
    setAllNotifications(NotificationManager.getNotifications());
  }, []);

  const showToast = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification = NotificationManager.addNotification(notification);
    
    // Add to active toasts
    setActiveToasts(prev => [...prev, newNotification]);
    
    // Update all notifications
    setAllNotifications(NotificationManager.getNotifications());
    
    return newNotification;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setActiveToasts(prev => prev.filter(toast => toast.id !== id));
    NotificationManager.markAsRead(id);
  }, []);

  const clearAllToasts = useCallback(() => {
    setActiveToasts([]);
  }, []);

  const triggerBudgetCheck = useCallback((expenses: any[], budget: any, categoryTotals: Record<string, number>) => {
    NotificationSystem.checkBudgetAndGenerateTips(expenses, budget, categoryTotals);
    
    // Refresh notifications
    setAllNotifications(NotificationManager.getNotifications());
  }, []);

  const getUnreadCount = useCallback(() => {
    return NotificationManager.getUnreadCount();
  }, []);

  const markAsRead = useCallback((id: string) => {
    NotificationManager.markAsRead(id);
    setAllNotifications(NotificationManager.getNotifications());
  }, []);

  return {
    activeToasts,
    allNotifications,
    showToast,
    dismissToast,
    clearAllToasts,
    triggerBudgetCheck,
    getUnreadCount,
    markAsRead,
  };
}

// Context for accessing notifications system-wide
interface NotificationContextType {
  activeToasts: Notification[];
  showToast: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => Notification;
  dismissToast: (id: string) => void;
  triggerBudgetCheck: (expenses: any[], budget: any, categoryTotals: Record<string, number>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const notifications = useNotifications();

  const contextValue: NotificationContextType = {
    activeToasts: notifications.activeToasts,
    showToast: notifications.showToast,
    dismissToast: notifications.dismissToast,
    triggerBudgetCheck: notifications.triggerBudgetCheck,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}