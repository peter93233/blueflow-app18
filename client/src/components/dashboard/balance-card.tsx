import React from 'react';
import { motion } from 'framer-motion';

interface BalanceCardProps {
  title: string;
  amount: string;
  index: number;
  onClick?: () => void;
}

export function BalanceCard({ title, amount, index, onClick }: BalanceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        delay: 0.2 + index * 0.1, 
        duration: 0.5, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -2,
        transition: { duration: 0.2 }
      }}
      onClick={onClick}
      className="bg-white/70 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="text-center">
        <motion.p
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
          className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800"
        >
          ${amount}
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
          className="text-xs sm:text-sm text-slate-600 mt-1 font-medium"
        >
          {title}
        </motion.p>
      </div>
    </motion.div>
  );
}