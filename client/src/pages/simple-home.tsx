import { useState, useEffect } from "react";
import { DollarSign, Plus, Edit3, PieChart, BarChart3, Settings, Target, Zap } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { SimpleExpenseModal } from "@/components/ui/simple-expense-modal";
import { ExpenseDisplay } from "@/components/ui/expense-display";
import FloatingAIButton from "@/components/ui/floating-ai-button";

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

export default function SimpleHome() {
  const [balance, setBalance] = useState(3200);
  const [showBalanceEdit, setShowBalanceEdit] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(500);

  // Load expenses from localStorage
  useEffect(() => {
    const loadExpenses = () => {
      const storedExpenses = localStorage.getItem('blueflow_expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        setExpenses(parsedExpenses);
        
        // Calculate total spent
        const total = parsedExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
        setTotalSpent(total);
        
        // Calculate remaining budget (assuming $500 default)
        const budget = 500;
        setRemainingBudget(budget - total);
      }
    };

    loadExpenses();
    
    // Listen for expense additions
    const handleExpenseAdded = () => {
      loadExpenses();
    };
    
    window.addEventListener('expenseAdded', handleExpenseAdded);
    return () => window.removeEventListener('expenseAdded', handleExpenseAdded);
  }, []);

  const handleBalanceUpdate = () => {
    const amount = parseFloat(newBalance);
    if (!isNaN(amount)) {
      setBalance(amount);
      localStorage.setItem('blueflow_balance', amount.toString());
      setShowBalanceEdit(false);
      setNewBalance("");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getBudgetPercentage = () => {
    const budget = 500;
    return budget > 0 ? (totalSpent / budget) * 100 : 0;
  };

  const getBudgetColor = () => {
    const percentage = getBudgetPercentage();
    if (percentage <= 60) return 'from-green-400 to-emerald-500';
    if (percentage <= 85) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with Balance */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
        >
          <div className="text-center space-y-2">
            <p className="text-sm text-slate-600">Current Balance</p>
            {showBalanceEdit ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={newBalance}
                  onChange={(e) => setNewBalance(e.target.value)}
                  placeholder={balance.toString()}
                  className="flex-1 px-3 py-2 bg-white/30 border border-white/40 rounded-xl text-center font-bold text-2xl focus:outline-none focus:ring-2 focus:ring-purple-300"
                />
                <button
                  onClick={handleBalanceUpdate}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium"
                >
                  ✓
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-3xl font-bold text-slate-800">{formatCurrency(balance)}</h1>
                <button
                  onClick={() => setShowBalanceEdit(true)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Budget Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-slate-800">Weekly Budget</h2>
            </div>
            <Link href="/budget-settings">
              <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Settings className="w-4 h-4 text-slate-600" />
              </button>
            </Link>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-slate-800">{formatCurrency(remainingBudget)}</span>
              <span className="text-sm text-slate-600">of $500 remaining</span>
            </div>
            
            <div className="w-full bg-white/30 rounded-full h-3">
              <div 
                className={`h-3 rounded-full bg-gradient-to-r ${getBudgetColor()} transition-all duration-300`}
                style={{ width: `${Math.min(getBudgetPercentage(), 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between text-sm text-slate-600">
              <span>Spent: {formatCurrency(totalSpent)}</span>
              <span>{getBudgetPercentage().toFixed(1)}% used</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddExpenseModal(true)}
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-3 font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </motion.div>

        {/* Expense Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ExpenseDisplay />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link href="/reports">
            <button className="w-full bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">Analytics</p>
                  <p className="text-sm text-slate-600">View Reports</p>
                </div>
              </div>
            </button>
          </Link>

          <Link href="/budget-settings">
            <button className="w-full bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30 hover:bg-white/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-xl">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">Goals</p>
                  <p className="text-sm text-slate-600">Set Budget</p>
                </div>
              </div>
            </button>
          </Link>
        </motion.div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/20 backdrop-blur-xl border-t border-white/30">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Link href="/">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-purple-600">
                <DollarSign className="w-5 h-5" />
                <span className="text-xs font-medium">Home</span>
              </button>
            </Link>
            <Link href="/add-expense">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-slate-600">
                <Plus className="w-5 h-5" />
                <span className="text-xs font-medium">Add</span>
              </button>
            </Link>
            <Link href="/reports">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-slate-600">
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs font-medium">Reports</span>
              </button>
            </Link>
            <Link href="/budget-settings">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-slate-600">
                <Settings className="w-5 h-5" />
                <span className="text-xs font-medium">Settings</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Floating AI Button */}
        <FloatingAIButton />

        {/* Add Expense Modal */}
        <SimpleExpenseModal 
          isOpen={showAddExpenseModal} 
          onClose={() => setShowAddExpenseModal(false)} 
        />
      </div>
    </div>
  );
}