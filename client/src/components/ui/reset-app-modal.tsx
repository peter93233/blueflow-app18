import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './button';

interface ResetAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetAppModal({ isOpen, onClose, onConfirm }: ResetAppModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/50 max-w-md w-full mx-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full w-10 h-10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800">Reset App</h3>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-8">
              <p className="text-slate-700 mb-4 leading-relaxed">
                Are you sure you want to reset all your data? This will permanently delete:
              </p>
              <ul className="text-sm text-slate-600 space-y-2 ml-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  All expenses and transactions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  Income records and history
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  Budget settings and progress
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  Account balance and archives
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  AI insights and notifications
                </li>
              </ul>
              <p className="text-sm text-red-600 font-medium mt-4 bg-red-50 p-3 rounded-lg">
                ⚠️ This action cannot be undone
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white border-0"
              >
                Reset All Data
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}