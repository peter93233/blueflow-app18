import { useState } from "react";
import { ArrowLeft, Plus, Calendar, DollarSign, Tag, Settings, BarChart3 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { AIAssistant } from "@/lib/ai-assistant";

export default function AddExpense() {
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Health', 'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expenseName.trim() || !expenseAmount || parseFloat(expenseAmount) <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    setIsSubmitting(true);

    try {
      const newExpense = {
        id: Date.now().toString(),
        name: expenseName.trim(),
        amount: parseFloat(expenseAmount),
        category: selectedCategory,
        date: selectedDate,
        createdAt: new Date().toISOString()
      };

      // Get existing expenses and add new one
      const existingExpenses = JSON.parse(localStorage.getItem('blueflow_expenses') || '[]');
      existingExpenses.push(newExpense);
      localStorage.setItem('blueflow_expenses', JSON.stringify(existingExpenses));

      // Check if this triggers a budget alert
      const budgetAmount = parseFloat(localStorage.getItem('blueflow_budget_amount') || '500');
      const totalSpent = existingExpenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
      const budgetPercentage = (totalSpent / budgetAmount) * 100;

      if (budgetPercentage >= 80) {
        AIAssistant.addNotification({
          type: 'budget_alert',
          title: 'Budget Alert',
          message: `You've used ${budgetPercentage.toFixed(1)}% of your budget. Consider reducing spending.`,
          read: false,
          icon: '⚠️'
        });
      }

      // Add success notification
      AIAssistant.addNotification({
        type: 'balance_update',
        title: 'Expense Added',
        message: `${newExpense.name} ($${newExpense.amount}) added to ${newExpense.category}`,
        read: false,
        icon: '✅'
      });

      // Reset form
      setExpenseName("");
      setExpenseAmount("");
      setSelectedCategory("Food");
      setSelectedDate(new Date().toISOString().split('T')[0]);

      // Show success message
      alert('Expense added successfully!');

      // Dispatch event to update other components
      window.dispatchEvent(new CustomEvent('expenseAdded'));

    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
          <h1 className="text-2xl font-bold text-slate-800">Add Expense</h1>
        </motion.div>

        {/* Add Expense Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Expense Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Tag className="w-4 h-4" />
                Expense Name
              </label>
              <input
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                placeholder="Enter expense name"
                className="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-500 text-slate-800"
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <DollarSign className="w-4 h-4" />
                Amount
              </label>
              <input
                type="number"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-slate-500 text-slate-800"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-800"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Calendar className="w-4 h-4" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-800"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl py-3 font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Add Expense
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Quick Preview */}
        {expenseName && expenseAmount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/20 backdrop-blur-xl rounded-3xl p-4 border border-white/30"
          >
            <h3 className="text-sm font-medium text-slate-700 mb-2">Preview</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">{expenseName}</p>
                <p className="text-sm text-slate-600">{selectedCategory} • {new Date(selectedDate).toLocaleDateString()}</p>
              </div>
              <p className="text-lg font-bold text-purple-600">
                {formatCurrency(parseFloat(expenseAmount) || 0)}
              </p>
            </div>
          </motion.div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/20 backdrop-blur-xl border-t border-white/30">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Link href="/">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-slate-600 hover:text-purple-600 transition-colors">
                <DollarSign className="w-5 h-5" />
                <span className="text-xs font-medium">Home</span>
              </button>
            </Link>
            <Link href="/add-expense">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-purple-600">
                <Plus className="w-5 h-5" />
                <span className="text-xs font-medium">Add</span>
              </button>
            </Link>
            <Link href="/reports">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-slate-600 hover:text-purple-600 transition-colors">
                <BarChart3 className="w-5 h-5" />
                <span className="text-xs font-medium">Reports</span>
              </button>
            </Link>
            <Link href="/budget-settings">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-slate-600 hover:text-purple-600 transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-xs font-medium">Settings</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom Navigation Spacer */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}