import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, AlertTriangle, TrendingUp, Calendar, Lightbulb } from "lucide-react";
import { Notification } from "@/lib/notification-system";

interface NotificationToastProps {
  notification: Notification;
  onDismiss: (id: string) => void;
  position: number; // Stack position
}

export function NotificationToast({ notification, onDismiss, position }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-dismiss after 5 seconds for low priority notifications
    if (notification.priority === 'low') {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification.priority]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300); // Wait for exit animation
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'budget_exceeded':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'balance_reminder':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'month_end':
        return <Calendar className="w-5 h-5 text-purple-500" />;
      case 'smart_tip':
        return <Lightbulb className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'high':
        return 'from-red-500/10 to-orange-500/10 border-red-200';
      case 'medium':
        return 'from-yellow-500/10 to-orange-500/10 border-yellow-200';
      case 'low':
        return 'from-blue-500/10 to-purple-500/10 border-blue-200';
      default:
        return 'from-gray-500/10 to-gray-500/10 border-gray-200';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 400, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            scale: 1,
            y: position * -80 // Stack notifications
          }}
          exit={{ opacity: 0, x: 400, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
          className={`fixed top-4 right-4 w-80 max-w-sm bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50 ${getPriorityColor()}`}
          style={{
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          {/* Priority indicator */}
          {notification.priority === 'high' && (
            <div className="h-1 bg-gradient-to-r from-red-500 to-orange-500"></div>
          )}
          {notification.priority === 'medium' && (
            <div className="h-1 bg-gradient-to-r from-yellow-500 to-orange-500"></div>
          )}

          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {notification.title}
                  </h4>
                  <button
                    onClick={handleDismiss}
                    className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-600" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed mb-2">
                  {notification.message}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(notification.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>

                  {notification.priority === 'high' && (
                    <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Subtle animation for attention */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 2, 
              delay: 0.5,
              repeat: notification.priority === 'high' ? Infinity : 0,
              repeatDelay: 3 
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface NotificationContainerProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

export function NotificationContainer({ notifications, onDismiss }: NotificationContainerProps) {
  // Sort by priority and timestamp
  const sortedNotifications = [...notifications].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {sortedNotifications.slice(0, 3).map((notification, index) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationToast
            notification={notification}
            onDismiss={onDismiss}
            position={index}
          />
        </div>
      ))}
    </div>
  );
}