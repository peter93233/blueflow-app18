import { useState, useEffect } from "react";
import { X, Brain, Lightbulb, Bell, TrendingUp, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AIAssistant, type Suggestion, type Notification } from "@/lib/ai-assistant";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistantModal({ isOpen, onClose }: AIAssistantModalProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'notifications'>('suggestions');

  useEffect(() => {
    if (isOpen) {
      // Generate suggestions when modal opens
      const weeklySuggestions = AIAssistant.generateWeeklySuggestions();
      setSuggestions(weeklySuggestions);
      
      // Load recent notifications
      const recentNotifications = AIAssistant.getRecentNotifications();
      setNotifications(recentNotifications);
    }
  }, [isOpen]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-400 to-red-500';
      case 'medium': return 'from-yellow-400 to-orange-500';
      case 'low': return 'from-green-400 to-emerald-500';
      default: return 'from-purple-400 to-purple-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'budget_alert': return 'from-red-400 to-red-500';
      case 'balance_update': return 'from-blue-400 to-blue-500';
      case 'monthly_reminder': return 'from-purple-400 to-purple-500';
      case 'achievement': return 'from-green-400 to-green-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="fixed inset-4 max-w-md mx-auto my-8 bg-white/20 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">AI Assistant</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex p-2 mx-6 mt-4 bg-white/30 rounded-2xl">
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'suggestions'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-white/40'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>Suggestions</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                  activeTab === 'notifications'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-slate-700 hover:bg-white/40'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Bell className="w-4 h-4" />
                  <span>Alerts</span>
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 overflow-y-auto">
              {activeTab === 'suggestions' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold text-slate-800">Weekly Smart Suggestions</h3>
                  </div>
                  
                  {suggestions.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Lightbulb className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No suggestions available</p>
                      <p className="text-sm">Add some expenses to get personalized tips!</p>
                    </div>
                  ) : (
                    suggestions.map((suggestion) => (
                      <motion.div
                        key={suggestion.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/40"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 bg-gradient-to-r ${getPriorityColor(suggestion.priority)} rounded-lg text-white text-sm`}>
                            {suggestion.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 mb-1">{suggestion.title}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{suggestion.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                                suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {suggestion.priority}
                              </span>
                              <span className="text-xs text-slate-500">
                                {formatTimeAgo(suggestion.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Bell className="w-4 h-4 text-purple-500" />
                    <h3 className="font-semibold text-slate-800">Recent Notifications</h3>
                  </div>
                  
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No recent notifications</p>
                      <p className="text-sm">Your alerts will appear here</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`bg-white/30 backdrop-blur-sm rounded-2xl p-4 border border-white/40 ${
                          !notification.read ? 'ring-2 ring-purple-300' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 bg-gradient-to-r ${getTypeColor(notification.type)} rounded-lg text-white text-sm`}>
                            {notification.icon}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800 mb-1">{notification.title}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{notification.message}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-slate-500">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              {!notification.read && (
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                  New
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
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