import React from 'react';
import { motion } from 'framer-motion';

interface BudgetProgressProps {
  currentAmount: string;
  totalBudget: string;
  percentage: number;
  onAddExpense?: () => void;
}

export function BudgetProgress({ 
  currentAmount, 
  totalBudget, 
  percentage, 
  onAddExpense 
}: BudgetProgressProps) {
  return (
    <div className="text-center mb-6">
      <motion.p
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 1.2, 
          duration: 0.6, 
          ease: "easeOut" 
        }}
        className="text-2xl sm:text-3xl font-bold text-slate-800"
      >
        ${currentAmount}
      </motion.p>
      
      <p className="text-sm text-slate-600 mt-1">
        of ${totalBudget} weekly budget
      </p>
      
      {/* Progress Bar */}
      <div className="w-full bg-slate-200 rounded-full h-2 my-4">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            delay: 1.6, 
            duration: 1.2, 
            ease: "easeInOut" 
          }}
          className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
        />
      </div>
      
      <motion.button
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          delay: 1.8, 
          duration: 0.5, 
          ease: "easeOut" 
        }}
        whileHover={{ 
          scale: 1.05, 
          transition: { duration: 0.2 }
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onAddExpense}
        className="mt-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-sm font-medium hover:shadow-lg transition-all duration-300"
      >
        Add Expense
      </motion.button>
    </div>
  );
}