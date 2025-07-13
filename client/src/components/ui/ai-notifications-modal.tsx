import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, Lightbulb, TrendingUp, Award } from 'lucide-react';
import { NotificationService, type Notification } from '@/lib/notification-service';

interface AINotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AINotificationsModal({ isOpen, onClose }: AINotificationsModalProps) {
  const notifications = NotificationService.getNotifications();
  const currentTip = NotificationService.getCurrentTip();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'budget_alert':
        return <Bell className="w-5 h-5 text-red-500" />;
      case 'savings_tip':
        return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'spending_trend':
        return <TrendingUp className="w-5 h-5 text-blue-500" />;
      case 'achievement':
        return <Award className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-96 md:max-h-[80vh] bg-white/90 backdrop-blur-xl rounded-2xl border border-white/50 shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">AI Assistant</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Current Tip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl border border-purple-200"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Today's Smart Tip</h3>
                    <p className="text-sm text-slate-700">{currentTip}</p>
                  </div>
                </div>
              </motion.div>

              {/* Notifications */}
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-800 mb-3">Recent Notifications</h3>
                
                {notifications.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center py-8 text-slate-500"
                  >
                    <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No notifications yet</p>
                    <p className="text-sm mt-1">Your AI assistant will notify you about budget insights</p>
                  </motion.div>
                ) : (
                  notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className={`p-4 rounded-xl border-l-4 ${getPriorityColor(notification.priority)}`}
                    >
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 text-sm">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-slate-700 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-slate-500 mt-2">
                            {notification.timestamp.toLocaleDateString()} at{' '}
                            {notification.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/30">
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    NotificationService.runWeeklyAnalysis();
                    window.location.reload();
                  }}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Run Weekly Analysis
                </button>
                <button
                  onClick={() => {
                    NotificationService.clearNotifications();
                    window.location.reload();
                  }}
                  className="text-sm text-slate-500 hover:text-slate-600"
                >
                  Clear All
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}