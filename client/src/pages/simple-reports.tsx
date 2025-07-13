import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, PieChart, BarChart3, Calendar, Target, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

export default function SimpleReports() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [totalSpent, setTotalSpent] = useState(0);

  // Load expenses from localStorage
  useEffect(() => {
    const storedExpenses = localStorage.getItem('blueflow_expenses');
    if (storedExpenses) {
      const parsedExpenses = JSON.parse(storedExpenses);
      setExpenses(parsedExpenses);
      
      // Calculate total spent
      const total = parsedExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
      setTotalSpent(total);
      
      // Calculate category totals
      const totals: Record<string, number> = {};
      parsedExpenses.forEach((expense: Expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
      });
      setCategoryTotals(totals);
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: '#F59E0B',
      Transport: '#3B82F6',
      Entertainment: '#EC4899',
      Shopping: '#10B981',
      Bills: '#6366F1',
      Health: '#EF4444',
      Other: '#6B7280'
    };
    return colors[category] || '#6B7280';
  };

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

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
          <h1 className="text-2xl font-bold text-slate-800">Reports</h1>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-slate-700">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalSpent)}</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-slate-700">Transactions</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{expenses.length}</p>
          </div>
        </motion.div>

        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Top Categories</h2>
              <p className="text-sm text-slate-600">Your spending breakdown</p>
            </div>
          </div>

          {topCategories.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No expenses to analyze</p>
              <p className="text-sm">Start adding expenses to see reports!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topCategories.map(([category, amount], index) => {
                const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getCategoryColor(category) }}
                        />
                        <span className="font-medium text-slate-800">{category}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">{formatCurrency(amount)}</p>
                        <p className="text-sm text-slate-600">{percentage.toFixed(1)}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                        className="h-2 rounded-full"
                        style={{ backgroundColor: getCategoryColor(category) }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Recent Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Quick Stats</h2>
              <p className="text-sm text-slate-600">At a glance</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/30 rounded-xl">
              <span className="text-slate-600">Average per transaction:</span>
              <span className="font-semibold text-slate-800">
                {expenses.length > 0 ? formatCurrency(totalSpent / expenses.length) : '$0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/30 rounded-xl">
              <span className="text-slate-600">Most expensive category:</span>
              <span className="font-semibold text-slate-800">
                {topCategories.length > 0 ? topCategories[0][0] : 'None'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/30 rounded-xl">
              <span className="text-slate-600">Total categories used:</span>
              <span className="font-semibold text-slate-800">{Object.keys(categoryTotals).length}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}