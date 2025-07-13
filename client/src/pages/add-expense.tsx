import { useState } from "react";
import { ArrowLeft, DollarSign, Calendar, Tag, Plus, Receipt } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useFinance } from "@/hooks/use-finance";
import { useNotifications } from "@/hooks/use-notifications";
import { EXPENSE_CATEGORIES } from "@/lib/finance-store";

export default function AddExpense() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { addExpenseWithBudgetUpdate, progress, budget, expenses, categoryTotals } = useFinance();
  const { triggerBudgetCheck, showToast } = useNotifications();

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

  const handleAddExpense = () => {
    if (!expenseName.trim()) {
      toast({
        title: "Missing Name",
        description: "Please enter an expense name",
        variant: "destructive"
      });
      return;
    }

    if (!amount || isNaN(parseFloat(amount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        title: "Missing Category",
        description: "Please select a category",
        variant: "destructive"
      });
      return;
    }

    const expenseAmount = parseFloat(amount);
    const expenseDate = new Date(selectedDate);

    // Add the expense
    const newExpense = addExpenseWithBudgetUpdate(
      expenseName.trim(),
      expenseAmount,
      selectedCategory,
      expenseDate
    );

    // Success notification
    showToast({
      type: 'smart_tip',
      title: "Expense Added",
      message: `${formatCurrency(amount)} expense "${expenseName}" added successfully`,
      priority: 'low',
      icon: '✅'
    });

    // Check budget status and trigger notifications if needed
    setTimeout(() => {
      triggerBudgetCheck(expenses, budget, categoryTotals);
    }, 500);

    // Navigate back to home
    setLocation("/");
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="float-layout">
        {/* Header */}
        <div className="flex items-center justify-between pt-12 pb-6">
          <Link href="/">
            <button className="glass-button-secondary p-3 rounded-xl hover-lift">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <div className="text-center">
            <h1 className="text-xl font-bold gradient-text-primary">Add Expense</h1>
            <p className="text-sm text-gray-500 mt-1">Track your spending</p>
          </div>
          <div className="w-12 h-12"></div> {/* Spacer */}
        </div>

        {/* Amount Preview Card */}
        {amount && (
          <div className="float-card text-center hover-lift glow-on-hover mb-4">
            <div className="p-6">
              <Receipt className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text-accent mb-2">
                {formatCurrency(amount)}
              </div>
              <p className="text-sm text-gray-600">
                {expenseName || "New expense"} • {selectedCategory || "No category"}
              </p>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="float-card hover-lift glow-on-hover">
          <div className="space-y-6">
            {/* Expense Name */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-purple-500" />
                Expense Name
              </label>
              <input
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="glass-input w-full"
                placeholder="Coffee, lunch, groceries..."
                required
              />
            </div>

            {/* Amount */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-500" />
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="glass-input w-full text-lg font-semibold"
                placeholder="0.00"
                required
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-3">
              {[5, 10, 25, 50].map((quickAmount) => (
                <button
                  type="button"
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount.toString())}
                  className="p-3 text-sm font-semibold text-gray-700 bg-white/20 rounded-lg hover:bg-white/40 transition-all border border-white/30"
                >
                  ${quickAmount}
                </button>
              ))}
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-500" />
                Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                {EXPENSE_CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`p-3 rounded-lg text-sm font-medium transition-all border ${
                      selectedCategory === cat
                        ? 'bg-purple-500/20 border-purple-500/50 text-purple-700'
                        : 'bg-white/20 border-white/30 text-gray-700 hover:bg-white/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-orange-500" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="glass-input w-full"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleAddExpense}
              className="glass-button-primary w-full py-4 text-lg font-semibold hover-lift"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Expense
            </button>
          </div>
        </div>

        {/* Tips Card */}
        <div className="float-card hover-lift">
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              💡 Quick Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Use quick amount buttons for common purchases</p>
              <p>• Choose the right category for better insights</p>
              <p>• Add expenses immediately to avoid forgetting</p>
            </div>
          </div>
        </div>

        {/* Budget Status Preview */}
        {budget && (
          <div className="float-card hover-lift">
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Budget Status</h3>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Remaining</p>
                  <p className="text-lg font-bold gradient-text-accent">
                    {formatCurrency(progress.remaining.toString())}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Spent</p>
                  <p className="text-lg font-bold text-orange-600">
                    {Math.round(progress.percentage)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}