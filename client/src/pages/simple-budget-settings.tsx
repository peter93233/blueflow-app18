import { useState, useEffect } from "react";
import { ArrowLeft, Target, Calendar, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

type BudgetPeriod = 'weekly' | 'biweekly' | 'monthly';

export default function SimpleBudgetSettings() {
  const [budgetAmount, setBudgetAmount] = useState(500);
  const [budgetPeriod, setBudgetPeriod] = useState<BudgetPeriod>('weekly');

  // Load budget from localStorage on component mount
  useEffect(() => {
    const storedBudget = localStorage.getItem('blueflow_budget');
    if (storedBudget) {
      try {
        const budget = JSON.parse(storedBudget);
        setBudgetAmount(budget.amount);
        setBudgetPeriod(budget.period);
      } catch (error) {
        console.error('Failed to load budget:', error);
      }
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

    // Save budget to localStorage
    const budgetData = {
      period: budgetPeriod,
      amount: budgetAmount,
      startDate: new Date().toISOString()
    };
    
    localStorage.setItem('blueflow_budget', JSON.stringify(budgetData));
    
    alert(`Budget updated! Your ${budgetPeriod} budget is now $${budgetAmount.toFixed(2)}`);
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
          <h1 className="text-2xl font-bold text-slate-800">Budget Settings</h1>
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

            {/* Budget Period */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Calendar className="w-4 h-4" />
                Budget Period
              </label>
              <div className="space-y-3">
                {budgetPeriods.map((period) => (
                  <label
                    key={period.value}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      budgetPeriod === period.value
                        ? 'border-purple-300 bg-purple-50/50'
                        : 'border-white/40 bg-white/20 hover:bg-white/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="budgetPeriod"
                        value={period.value}
                        checked={budgetPeriod === period.value}
                        onChange={(e) => setBudgetPeriod(e.target.value as BudgetPeriod)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <div>
                        <p className="font-medium text-slate-800">{period.label}</p>
                        <p className="text-sm text-slate-600">{period.description}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl py-4 font-semibold transition-colors shadow-lg"
            >
              Save Budget Settings
            </button>
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
      </div>
    </div>
  );
}