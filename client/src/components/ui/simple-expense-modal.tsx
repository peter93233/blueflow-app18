import { useState } from "react";
import { X, Plus, DollarSign, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SimpleExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SimpleExpenseModal({ isOpen, onClose }: SimpleExpenseModalProps) {
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Health", "Other"];

  const handleSubmit = () => {
    if (!expenseName.trim() || !amount) {
      alert("Please fill in all required fields");
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    // Save to localStorage
    const newExpense = {
      id: Date.now().toString(),
      name: expenseName,
      amount: expenseAmount,
      category: selectedCategory,
      date: selectedDate,
      createdAt: new Date().toISOString()
    };

    const existingExpenses = JSON.parse(localStorage.getItem('blueflow_expenses') || '[]');
    existingExpenses.push(newExpense);
    localStorage.setItem('blueflow_expenses', JSON.stringify(existingExpenses));

    // Reset form
    setExpenseName("");
    setAmount("");
    setSelectedCategory("Food");
    setSelectedDate(new Date().toISOString().split('T')[0]);
    onClose();

    // Trigger page reload to update all data
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 w-full max-w-md shadow-2xl border border-white/30"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Add New Expense</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Expense Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Expense Name
                </label>
                <input
                  type="text"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  placeholder="Enter expense name"
                  className="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-xl text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent backdrop-blur-sm"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white/30 border border-white/40 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-white/20 hover:bg-white/30 text-slate-700 rounded-xl font-medium transition-colors backdrop-blur-sm border border-white/30"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Expense
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}