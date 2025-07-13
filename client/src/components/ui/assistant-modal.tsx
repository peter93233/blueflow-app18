import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, Lightbulb, Bell, TrendingUp, Calendar, AlertTriangle } from "lucide-react";
import { Notification, SmartTip, NotificationManager, SmartTipsGenerator } from "@/lib/notification-system";

interface AssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount: number;
}

export function AssistantModal({ isOpen, onClose, unreadCount }: AssistantModalProps) {
  const [activeTab, setActiveTab] = useState<'tips' | 'notifications'>('tips');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [latestTip, setLatestTip] = useState<SmartTip | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNotifications(NotificationManager.getRecentNotifications(5));
      setLatestTip(SmartTipsGenerator.getLatestTip());
    }
  }, [isOpen]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'budget_exceeded':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'balance_reminder':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'month_end':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'smart_tip':
        return <Lightbulb className="w-4 h-4 text-green-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTipIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'budgeting':
        return '💰';
      case 'food & dining':
        return '🍽️';
      case 'transportation':
        return '🚗';
      case 'shopping':
        return '🛍️';
      case 'entertainment':
        return '🎬';
      case 'spending_habits':
        return '📊';
      case 'planning':
        return '📋';
      default:
        return '💡';
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30 
            }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl z-50 overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Header */}
            <div className="relative p-6 pb-4 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">BlueFlow Assistant</h2>
                    <p className="text-sm text-gray-600">Your financial insights</p>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Tab Navigation */}
              <div className="flex mt-4 bg-white/50 rounded-full p-1">
                <button
                  onClick={() => setActiveTab('tips')}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'tips'
                      ? 'bg-white shadow-sm text-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Lightbulb className="w-4 h-4" />
                  Tips
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all flex items-center justify-center gap-2 relative ${
                    activeTab === 'notifications'
                      ? 'bg-white shadow-sm text-purple-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  Alerts
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-2 max-h-96 overflow-y-auto">
              {activeTab === 'tips' ? (
                <div className="space-y-4">
                  {/* This Week's Tip */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-500" />
                      This Week's Tip
                    </h3>
                    
                    {latestTip ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{getTipIcon(latestTip.category)}</div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 leading-relaxed">
                              {latestTip.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              {formatTimeAgo(latestTip.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="bg-gray-50 rounded-2xl p-4 text-center">
                        <Lightbulb className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Add some expenses to get personalized tips!
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Recent Tips */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Insights</h3>
                    <div className="space-y-2">
                      {SmartTipsGenerator.getSmartTips().slice(1, 4).map((tip, index) => (
                        <motion.div
                          key={tip.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-50 rounded-xl p-3"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-lg">{getTipIcon(tip.category)}</span>
                            <div className="flex-1">
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {tip.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTimeAgo(tip.timestamp)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {SmartTipsGenerator.getSmartTips().length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No recent insights yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-500" />
                    Recent Notifications
                  </h3>
                  
                  {notifications.length > 0 ? (
                    notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-gray-50 rounded-xl p-3 ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatTimeAgo(notification.timestamp)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">No notifications yet</p>
                      <p className="text-xs text-gray-500 mt-1">
                        You'll see budget alerts and reminders here
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}