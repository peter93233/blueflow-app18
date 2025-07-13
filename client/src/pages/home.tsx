import { DollarSign, TrendingUp, PieChart, BarChart3, Mic, Brain, Settings, Plus } from "lucide-react";
import { useFinance, useFinanceStats } from "@/hooks/use-finance";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import FloatingAIButton from "@/components/ui/floating-ai-button";
import { useNotifications } from "@/hooks/use-notifications";

export default function Home() {
  const { balance, budget, progress, expenses, categoryTotals } = useFinance();
  const { getTopCategories, getWeeklyTrend, getBudgetHealth } = useFinanceStats();
  const { triggerBudgetCheck, showToast } = useNotifications();
  const [showBalanceEdit, setShowBalanceEdit] = useState(false);
  const [newBalance, setNewBalance] = useState("");

  // Initialize with demo notification on first load
  useEffect(() => {
    const hasShownDemo = localStorage.getItem('blueflow_demo_notification');
    if (!hasShownDemo && expenses.length > 0) {
      setTimeout(() => {
        showToast({
          type: 'smart_tip',
          title: 'Welcome to BlueFlow!',
          message: 'Your AI assistant is ready to help you manage your finances. Try adding an expense to see smart suggestions!',
          priority: 'medium',
          icon: '🎉'
        });
        localStorage.setItem('blueflow_demo_notification', 'true');
      }, 2000);
    }
  }, [expenses.length, showToast]);

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate available balance (balance - budget spent)
  const availableBalance = balance - progress.spent;
  const savingsGoal = balance * 0.2; // Assume 20% savings goal

  // Get top spending categories for donut charts
  const topCategories = getTopCategories(4);
  const weeklyTrend = getWeeklyTrend();
  const budgetHealth = getBudgetHealth();

  const handleBalanceUpdate = () => {
    if (newBalance && !isNaN(parseFloat(newBalance))) {
      const finance = useFinance();
      finance.updateBalance(parseFloat(newBalance));
      setShowBalanceEdit(false);
      setNewBalance("");
    }
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with Assistant Icon */}
        <div className="flex justify-between items-center pt-8 pb-4">
          <div>
            <p className="text-sm text-gray-600">{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
            <div className="flex items-center gap-2 mt-2">
              <Brain className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium">BlueFlow Assistant</span>
            </div>
          </div>
          <Link href="/budget-settings">
            <div className="w-8 h-8 bg-orange-100 rounded-md flex items-center justify-center cursor-pointer hover:bg-orange-200 transition-colors">
              <Settings className="w-4 h-4 text-orange-500" />
            </div>
          </Link>
        </div>

        {/* Balance Cards Row - Now with real data */}
        <div className="grid grid-cols-3 gap-3">
          <div 
            className="glass-card-modern p-4 text-center cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setShowBalanceEdit(true)}
          >
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(balance)}</p>
            <p className="text-xs text-gray-600 mt-1">Total Balance</p>
          </div>
          <div className="glass-card-modern p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(Math.max(0, availableBalance))}</p>
            <p className="text-xs text-gray-600 mt-1">Available</p>
          </div>
          <div className="glass-card-modern p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(savingsGoal)}</p>
            <p className="text-xs text-gray-600 mt-1">Savings Goal</p>
          </div>
        </div>

        {/* Balance Edit Modal */}
        {showBalanceEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="glass-card-modern p-6 m-4 w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4">Update Balance</h3>
              <input
                type="number"
                value={newBalance}
                onChange={(e) => setNewBalance(e.target.value)}
                placeholder="Enter new balance"
                className="w-full p-3 rounded-lg border border-gray-300 mb-4"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBalanceEdit(false)}
                  className="flex-1 p-3 rounded-lg border border-gray-300 text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBalanceUpdate}
                  className="flex-1 gradient-button-primary"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Weekly Spending Section - Now with real data */}
        <div className="glass-card-subtle p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Spending</h3>
            <div className="flex gap-2">
              <span className="text-xs text-gray-500">This Week: {formatCurrency(weeklyTrend.thisWeek)}</span>
              <span className="text-xs text-gray-500">Last Week: {formatCurrency(weeklyTrend.lastWeek)}</span>
            </div>
          </div>

          {/* Donut Charts Grid - Dynamic based on real categories */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {topCategories.slice(0, 4).map((category, index) => {
              const colors = ['#06b6d4', '#fbbf24', '#f472b6', '#8b5cf6'];
              const maxAmount = Math.max(...topCategories.map(c => c.amount));
              const percentage = maxAmount > 0 ? (category.amount / maxAmount) * 100 : 0;
              
              return (
                <div key={category.category} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-2">
                    <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="3"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke={colors[index]}
                        strokeWidth="3"
                        strokeDasharray={`${percentage} ${100 - percentage}`}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-700">{formatCurrency(category.amount)}</p>
                  <p className="text-xs text-gray-500">{category.category.split(' ')[0]}</p>
                </div>
              );
            })}
            
            {/* Fill empty slots if less than 4 categories */}
            {Array.from({ length: Math.max(0, 4 - topCategories.length) }).map((_, index) => (
              <div key={`empty-${index}`} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
                <p className="text-xs font-medium text-gray-700">$0.00</p>
                <p className="text-xs text-gray-500">No data</p>
              </div>
            ))}
          </div>
        </div>

        {/* Income Breakdown Chart */}
        <div className="glass-card-subtle p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Income Breakdown</h3>
            <div className="flex gap-4 text-xs">
              <span className="text-pink-500">● Online Sales</span>
              <span className="text-blue-500">● Offline</span>
            </div>
          </div>

          {/* Animated Line Chart Placeholder */}
          <div className="h-32 relative">
            <svg className="w-full h-full" viewBox="0 0 400 120">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="40" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 24" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Line charts */}
              <path
                d="M 0 80 Q 100 60, 200 70 T 400 50"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 0 100 Q 100 90, 200 85 T 400 75"
                fill="none"
                stroke="#f472b6"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Chart Labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Oct 12</span>
            <span>Oct 13</span>
            <span>Oct 14</span>
            <span>Oct 15</span>
          </div>
        </div>

        {/* Smart Budget Track - Real budget data */}
        <div className="glass-card-subtle p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Budget Track</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(progress.remaining)}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-sm ${budgetHealth === 'healthy' ? 'text-green-600' : budgetHealth === 'warning' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {progress.percentage}% of budget used
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {budget ? `${formatCurrency(budget.amount)} ${budget.period} budget` : 'No budget set'}
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <Link href="/add-expense">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                  <Plus className="w-8 h-8 text-white" />
                </div>
              </Link>
              <div className="flex gap-2">
                <span className="text-pink-500 text-xs">{formatCurrency(progress.spent)}</span>
                <span className="text-gray-400 text-xs">Spent this period</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation - Float-based layout */}
        <div className="fixed bottom-0 left-0 right-0 glass-card-modern m-4 p-4">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <Link href="/">
              <button className="flex flex-col items-center gap-1">
                <BarChart3 className="w-6 h-6 text-purple-500" />
                <span className="text-xs text-gray-600">Dashboard</span>
              </button>
            </Link>
            <Link href="/add-expense">
              <button className="flex flex-col items-center gap-1">
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-600">Add Expense</span>
              </button>
            </Link>
            <Link href="/reports">
              <button className="flex flex-col items-center gap-1">
                <TrendingUp className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-600">Reports</span>
              </button>
            </Link>
            <Link href="/budget-settings">
              <button className="flex flex-col items-center gap-1">
                <DollarSign className="w-6 h-6 text-gray-400" />
                <span className="text-xs text-gray-600">Budget</span>
              </button>
            </Link>
          </div>
        </div>

        {/* AI Assistant Floating Button */}
        <FloatingAIButton />
      </div>
    </div>
  );
}