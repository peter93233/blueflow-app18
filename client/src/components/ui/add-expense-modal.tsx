import { useState } from "react";
import { X, Plus, DollarSign, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFinance } from "@/hooks/use-finance";
import { useNotifications } from "@/hooks/use-notifications";
import { EXPENSE_CATEGORIES } from "@/lib/finance-store";

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const { addExpenseWithBudgetUpdate, budget, expenses, categoryTotals, progress } = useFinance();
  const { showToast, triggerBudgetCheck } = useNotifications();
  
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const formatCurrency = (value: string) => {
    if (!value) return "";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(value));
  };

  const handleSubmit = () => {
    if (!expenseName.trim() || !amount || !selectedCategory) {
      showToast({
        type: 'budget_exceeded',
        title: 'Missing Information',
        message: 'Please fill in all required fields',
        priority: 'medium',
        icon: '⚠️'
      });
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      showToast({
        type: 'budget_exceeded',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount',
        priority: 'medium',
        icon: '⚠️'
      });
      return;
    }

    // Add the expense
    addExpenseWithBudgetUpdate(
      expenseName.trim(),
      expenseAmount,
      selectedCategory,
      new Date(selectedDate)
    );

    // Success notification
    showToast({
      type: 'smart_tip',
      title: "Expense Added",
      message: `${formatCurrency(amount)} expense "${expenseName}" added successfully`,
      priority: 'low',
      icon: '✅'
    });

    // Check budget status
    setTimeout(() => {
      triggerBudgetCheck(expenses, budget, categoryTotals);
    }, 500);

    // Reset form and close
    setExpenseName("");
    setAmount("");
    setSelectedCategory("");
    setSelectedDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const quickAmounts = [5, 10, 25, 50];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="float-card w-full max-w-md hover-lift"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold gradient-text-primary">Add New Expense</h2>
              <button
                onClick={onClose}
                className="glass-button-secondary p-2 rounded-full hover-lift"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Amount Preview */}
            {amount && (
              <div className="text-center mb-6 p-4 bg-white/20 rounded-lg">
                <div className="text-2xl font-bold gradient-text-accent mb-1">
                  {formatCurrency(amount)}
                </div>
                <p className="text-sm text-gray-600">
                  {expenseName || "New expense"} • {selectedCategory || "Select category"}
                </p>
              </div>
            )}

            {/* Form */}
            <div className="space-y-4">
              {/* Expense Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-purple-500" />
                  Expense Name
                </label>
                <input
                  type="text"
                  value={expenseName}
                  onChange={(e) => setExpenseName(e.target.value)}
                  className="glass-input"
                  placeholder="Coffee, lunch, groceries..."
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-500" />
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="glass-input"
                  placeholder="0.00"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    onClick={() => setAmount(quickAmount.toString())}
                    className="p-2 text-sm font-semibold text-gray-700 bg-white/20 rounded-lg hover:bg-white/40 transition-all"
                  >
                    ${quickAmount}
                  </button>
                ))}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-500" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="glass-input"
                >
                  <option value="">Select category</option>
                  {EXPENSE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="glass-input"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="glass-button-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="glass-button-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Expense
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}