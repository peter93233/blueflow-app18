import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Bell } from "lucide-react";
import { AINotificationsModal } from "./ai-notifications-modal";
import { NotificationService } from "@/lib/notification-service";

interface FloatingAIButtonProps {
  className?: string;
}

export default function FloatingAIButton({ className = "" }: FloatingAIButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    // Update unread count
    updateUnreadCount();
    
    // Check for notifications periodically
    const interval = setInterval(() => {
      updateUnreadCount();
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const updateUnreadCount = () => {
    const notifications = NotificationService.getNotifications();
    const count = notifications.length;
    setUnreadCount(count);
    
    // Show pulse animation for new notifications
    if (count > 0) {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 2000);
    }
  };

  const handleClick = () => {
    setIsModalOpen(true);
    
    // Update count after opening modal
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
          <div className="relative">
            <Brain className="w-7 h-7 text-white relative z-10" />
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
              >
                <span className="text-white text-xs font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </motion.div>
            )}
          </div>


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

      {/* AI Assistant Modal */}
      <AINotificationsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
