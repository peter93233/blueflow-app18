import { useState, useEffect } from "react";
import { Trash2, Calendar, DollarSign, Tag } from "lucide-react";
import { motion } from "framer-motion";

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

interface ExpenseDisplayProps {
  className?: string;
}

export function ExpenseDisplay({ className = "" }: ExpenseDisplayProps) {
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
    
    // Listen for storage changes
    const handleStorageChange = () => {
      loadExpenses();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const deleteExpense = (id: string) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem('blueflow_expenses', JSON.stringify(updatedExpenses));
    
    // Recalculate totals
    const total = updatedExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
    setTotalSpent(total);
    setRemainingBudget(500 - total);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-slate-700">Total Spent</span>
          </div>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(totalSpent)}</p>
        </div>
        
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-slate-700">Remaining</span>
          </div>
          <p className="text-xl font-bold text-slate-800">{formatCurrency(remainingBudget)}</p>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Expenses</h3>
        
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No expenses added yet</p>
            <p className="text-sm">Start tracking your spending!</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {expenses.map((expense, index) => (
              <motion.div
                key={expense.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/30 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(expense.category) }}
                  />
                  <div>
                    <p className="font-medium text-slate-800">{expense.name}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <span>{expense.category}</span>
                      <span>•</span>
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(expense.amount)}
                  </span>
                  <button
                    onClick={() => deleteExpense(expense.id)}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}