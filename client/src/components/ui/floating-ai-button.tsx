import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain } from "lucide-react";
import { AssistantModal } from "./assistant-modal";
import { NotificationSystem, NotificationManager } from "@/lib/notification-system";

interface FloatingAIButtonProps {
  className?: string;
}

export default function FloatingAIButton({ className = "" }: FloatingAIButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Initialize notification system
    NotificationSystem.initialize();
    
    // Update unread count
    updateUnreadCount();
    
    // Check for notifications periodically
    const interval = setInterval(() => {
      updateUnreadCount();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateUnreadCount = () => {
    const count = NotificationManager.getUnreadCount();
    setUnreadCount(count);
    
    // Show pulse animation for new notifications
    if (count > 0) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    }
  };

  const handleClick = () => {
    setIsModalOpen(true);
    
    // Mark recent notifications as read when opening modal
    const recentNotifications = NotificationManager.getRecentNotifications(3);
    recentNotifications.forEach(notification => {
      if (!notification.read) {
        NotificationManager.markAsRead(notification.id);
      }
    });
    
    // Update count after marking as read
    setTimeout(updateUnreadCount, 100);
  };

  return (
    <>
      <div className={`ai-assistant-floating z-40 ${className}`}>
        <motion.button
          onClick={handleClick}
          className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
          animate={{
            y: [0, -10, 0],
            opacity: 1,
            scale: 1
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            },
            opacity: { delay: 1, duration: 0.5 },
            scale: { delay: 1, duration: 0.5 }
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0 }}
        >
          <Brain className="w-7 h-7 text-white relative z-10" />
          
          {/* Notification badge */}
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg z-20"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pulse animation for new notifications */}
          <AnimatePresence>
            {showPulse && (
              <motion.div
                initial={{ scale: 1, opacity: 0.8 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 to-blue-600"
              />
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Assistant Modal */}
      <AssistantModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        unreadCount={unreadCount}
      />
    </>
  );
}
