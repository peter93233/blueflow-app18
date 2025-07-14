import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, DollarSign } from 'lucide-react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';

interface AddIncomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddIncome: (income: {
    amount: number;
    source: string;
    date: Date;
  }) => void;
}

/**
 * Add Income Modal Component
 * Provides a beautiful, animated form for adding income entries
 * Includes amount validation, source input, and date selection
 * Uses consistent BlueFlow styling with glass morphism effects
 */
export function AddIncomeModal({ isOpen, onClose, onAddIncome }: AddIncomeModalProps) {
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form submission with validation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !source) {
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAddIncome({
        amount: parsedAmount,
        source: source.trim(),
        date: new Date(date),
      });
      
      // Reset form
      setAmount('');
      setSource('');
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
    } catch (error) {
      console.error('Error adding income:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isSubmitting) {
      setAmount('');
      setSource('');
      setDate(new Date().toISOString().split('T')[0]);
      onClose();
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
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md border border-white/50 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center"
                  >
                    <Plus className="w-5 h-5 text-white" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Add Income</h2>
                    <p className="text-sm text-slate-600">Record your income source</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Amount Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Label htmlFor="amount" className="text-sm font-medium text-slate-700">
                    Amount
                  </Label>
                  <div className="relative mt-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-10 bg-white/50 border-white/50 focus:border-green-300 focus:ring-green-200"
                      required
                    />
                  </div>
                </motion.div>

                {/* Source Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <Label htmlFor="source" className="text-sm font-medium text-slate-700">
                    Source
                  </Label>
                  <Input
                    id="source"
                    type="text"
                    placeholder="e.g., Salary, Freelance, Investment"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="mt-1 bg-white/50 border-white/50 focus:border-green-300 focus:ring-green-200"
                    required
                  />
                </motion.div>

                {/* Date Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                >
                  <Label htmlFor="date" className="text-sm font-medium text-slate-700">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 bg-white/50 border-white/50 focus:border-green-300 focus:ring-green-200"
                    required
                  />
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="flex gap-3 pt-4"
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !amount || !source}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        Adding...
                      </div>
                    ) : (
                      'Add Income'
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}