import { useState } from "react";
import { ArrowLeft, DollarSign, Calendar, Tag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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
      message: `${formatCurrency(expenseAmount)} expense "${expenseName}" added successfully`,
      priority: 'low',
      icon: '✅'
    });

    // Trigger budget notifications and smart tips
    triggerBudgetCheck(expenses, budget, categoryTotals);

    // Show specific budget alert if needed
    if (budget && progress.percentage > 85) {
      showToast({
        type: 'budget_exceeded',
        title: "Budget Alert",
        message: `You've used ${Math.round(progress.percentage)}% of your ${budget.period} budget. Consider reviewing your spending.`,
        priority: progress.percentage > 95 ? 'high' : 'medium',
        icon: '⚠️'
      });
    }

    // Clear form
    setExpenseName("");
    setAmount("");
    setSelectedCategory("");
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const handleBack = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pt-8 pb-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full glass-card-modern flex items-center justify-center hover:scale-105 transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          
          <h1 className="text-xl font-bold text-gray-900">Add Expense</h1>
          
          <div className="w-10"></div>
        </div>

        {/* Budget Status Card */}
        {budget && (
          <div className="glass-card-subtle p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Budget Remaining</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(progress.remaining)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Used</p>
                <p className={`text-lg font-semibold ${
                  progress.percentage <= 60 ? 'text-green-600' : 
                  progress.percentage <= 85 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {progress.percentage}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expense Form */}
        <div className="glass-card-modern p-6 space-y-6">
          {/* Expense Name */}
          <div className="space-y-2">
            <Label htmlFor="expense-name" className="text-gray-700 font-medium">
              Expense Name
            </Label>
            <div className="relative">
              <Input
                id="expense-name"
                type="text"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                placeholder="Enter expense name"
                className="pl-10 glass-card-subtle border-0 focus:ring-2 focus:ring-purple-500"
              />
              <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-700 font-medium">
              Amount
            </Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="pl-10 glass-card-subtle border-0 focus:ring-2 focus:ring-purple-500"
              />
              <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-gray-700 font-medium">Category</Label>
            <div className="grid grid-cols-2 gap-3">
              {EXPENSE_CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'gradient-button-primary text-white'
                      : 'glass-card-subtle text-gray-700 hover:scale-105'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-gray-700 font-medium">
              Date
            </Label>
            <div className="relative">
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 glass-card-subtle border-0 focus:ring-2 focus:ring-purple-500"
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleAddExpense}
            className="w-full gradient-button-primary text-white font-semibold py-4 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Expense
          </Button>
        </div>

        {/* Quick Amount Buttons */}
        <div className="glass-card-subtle p-4">
          <p className="text-sm text-gray-600 mb-3">Quick amounts</p>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 25, 50].map((quickAmount) => (
              <button
                key={quickAmount}
                onClick={() => setAmount(quickAmount.toString())}
                className="p-2 rounded-lg glass-card-modern text-sm font-medium text-gray-700 hover:scale-105 transition-transform"
              >
                ${quickAmount}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}