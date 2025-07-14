import { useState, useEffect } from "react";
import { ArrowLeft, Target, Calendar, DollarSign, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from '@/lib/auth';
import { DataResetManager } from '@/lib/data-reset';
import { ResetAppModal } from '@/components/ui/reset-app-modal';

type BudgetPeriod = 'weekly' | 'biweekly' | 'monthly';

export default function SimpleBudgetSettings() {
  const { user } = useAuth();
  const [budgetAmount, setBudgetAmount] = useState(500);
  const [budgetPeriod, setBudgetPeriod] = useState<BudgetPeriod>('weekly');
  const [showResetModal, setShowResetModal] = useState(false);

  // Load budget settings from localStorage on component mount
  // This ensures the selected options persist even after refresh
  useEffect(() => {
    const storedBudgetType = localStorage.getItem('blueflow_budget_type');
    const storedBudgetAmount = localStorage.getItem('blueflow_budget_amount');
    
    if (storedBudgetType) {
      setBudgetPeriod(storedBudgetType as BudgetPeriod);
    }
    
    if (storedBudgetAmount) {
      setBudgetAmount(parseFloat(storedBudgetAmount));
    }
  }, []);

  const budgetPeriods: { value: BudgetPeriod; label: string; description: string }[] = [
    { value: 'weekly', label: 'Weekly', description: 'Reset every week' },
    { value: 'biweekly', label: 'Bi-weekly', description: 'Reset every 2 weeks' },
    { value: 'monthly', label: 'Monthly', description: 'Reset every month' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (budgetAmount <= 0) {
      alert('Please enter a valid budget amount');
      return;
    }

    // Save budget frequency and amount to localStorage using the specified keys
    // This allows the main dashboard to use this amount as the base budget
    localStorage.setItem('blueflow_budget_type', budgetPeriod);
    localStorage.setItem('blueflow_budget_amount', budgetAmount.toString());
    
    // Also save a timestamp for future expansion (tracking when budget was last updated)
    localStorage.setItem('blueflow_budget_updated', new Date().toISOString());
    
    alert(`Budget updated! Your ${budgetPeriod} budget is now $${budgetAmount.toFixed(2)}`);
    
    // Return to dashboard after saving - can be expanded to use proper navigation
    window.location.href = '/';
  };

  const handleResetApp = async () => {
    try {
      // Update user onboarding status to trigger onboarding flow
      const updateUserOnboardingStatus = async (isCompleted: boolean) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          const response = await fetch('/api/auth/complete-onboarding', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ isCompleted })
          });
          
          if (!response.ok) {
            throw new Error('Failed to update onboarding status');
          }
        }
      };

      // Perform complete app reset
      await DataResetManager.completeAppReset(updateUserOnboardingStatus);
      
      // Close modal
      setShowResetModal(false);
      
      // Navigate to home to show fresh state
      window.location.href = '/';
    } catch (error) {
      console.error('Reset failed:', error);
      alert('Reset failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 pt-4"
        >
          <Link href="/">
            <button className="p-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Set Your Budget</h1>
        </motion.div>

        {/* Budget Settings Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Set Your Budget</h2>
              <p className="text-sm text-slate-600">Control your spending goals</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Budget Amount */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <DollarSign className="w-4 h-4" />
                Budget Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={budgetAmount}
                  onChange={(e) => setBudgetAmount(parseFloat(e.target.value) || 0)}
                  placeholder="Enter budget amount"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-4 pl-8 bg-white/30 border border-white/40 rounded-2xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent backdrop-blur-sm text-lg font-semibold"
                />
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Budget Period - Segmented Control Style */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Calendar className="w-4 h-4" />
                Budget Frequency
              </label>
              
              {/* Segmented control for budget frequency selection */}
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-2 border border-white/40">
                <div className="grid grid-cols-3 gap-1">
                  {budgetPeriods.map((period) => (
                    <button
                      key={period.value}
                      type="button"
                      onClick={() => setBudgetPeriod(period.value)}
                      className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                        budgetPeriod === period.value
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : 'text-slate-700 hover:bg-white/40'
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Description for selected period */}
              <p className="text-sm text-slate-600 text-center">
                {budgetPeriods.find(p => p.value === budgetPeriod)?.description}
              </p>
            </div>

            {/* Save Budget Button - Glass Style */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-xl border border-white/30 hover:from-purple-600/80 hover:to-pink-600/80 text-white rounded-2xl py-4 font-semibold transition-all duration-200 shadow-xl"
            >
              Save Budget
            </motion.button>
          </form>
        </motion.div>

        {/* Current Budget Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Current Settings</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Budget Amount:</span>
              <span className="font-semibold text-slate-800">${budgetAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Period:</span>
              <span className="font-semibold text-slate-800 capitalize">{budgetPeriod}</span>
            </div>
          </div>
        </motion.div>

        {/* Reset App Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-3">Reset App</h3>
          <p className="text-slate-600 text-sm mb-4 leading-relaxed">
            Clear all your financial data and start fresh. This will delete all expenses, income, budgets, and settings.
          </p>
          
          <button
            onClick={() => setShowResetModal(true)}
            className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Trash2 className="w-4 h-4" />
            <span className="font-medium">Reset App</span>
          </button>
        </motion.div>

        {/* Reset App Modal */}
        <ResetAppModal
          isOpen={showResetModal}
          onClose={() => setShowResetModal(false)}
          onConfirm={handleResetApp}
        />
      </div>
    </div>
  );
}