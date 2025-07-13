import { DollarSign, TrendingUp, PieChart, BarChart3, Settings, Plus, Edit3, Wallet, Target, Zap } from "lucide-react";
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
    <div className="min-h-screen pb-32">
      <div className="float-layout">
        {/* Header Section */}
        <div className="flex justify-between items-start pt-12 pb-6">
          <div>
            <p className="text-sm text-gray-500 font-medium">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
            <h1 className="text-2xl font-bold gradient-text-primary mt-1">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}
            </h1>
          </div>
          <Link href="/budget-settings">
            <button className="glass-button-secondary p-3 rounded-xl hover-lift">
              <Settings className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* Balance Card */}
        <div className="float-card hover-lift glow-on-hover">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Balance</p>
              <div className="flex items-center gap-3">
                <div className="balance-display">
                  {formatCurrency(balance)}
                </div>
                <button 
                  onClick={() => setShowBalanceEdit(!showBalanceEdit)}
                  className="p-2 rounded-full bg-white/30 hover:bg-white/50 transition-all"
                >
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              {showBalanceEdit && (
                <div className="flex gap-2 mt-3">
                  <input
                    type="number"
                    value={newBalance}
                    onChange={(e) => setNewBalance(e.target.value)}
                    placeholder="New balance"
                    className="glass-input flex-1 text-sm"
                  />
                  <button 
                    onClick={handleBalanceUpdate}
                    className="glass-button-primary text-xs px-3"
                  >
                    Update
                  </button>
                </div>
              )}
            </div>
            <div className="p-3 rounded-full bg-gradient-to-br from-green-400/20 to-blue-500/20">
              <Wallet className="w-6 h-6 text-green-600" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Available</p>
              <p className="text-lg font-bold gradient-text-accent">
                {formatCurrency(availableBalance)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Savings Goal</p>
              <p className="text-lg font-bold gradient-text-accent">
                {formatCurrency(savingsGoal)}
              </p>
            </div>
          </div>
        </div>

        {/* Budget Progress */}
        {budget && (
          <div className="float-card hover-lift glow-on-hover">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold gradient-text-primary">Weekly Budget</h3>
                <p className="text-sm text-gray-600">
                  {formatCurrency(progress.remaining)} remaining
                </p>
              </div>
              <Link href="/add-expense">
                <button className="glass-button-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </button>
              </Link>
            </div>

            <div className="relative">
              {/* Progress Ring */}
              <div className="flex justify-center mb-6">
                <div className="progress-ring w-32 h-32">
                  <div className="progress-ring-inner w-full h-full">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text-primary">
                        {Math.round(progress.percentage)}%
                      </div>
                      <div className="text-xs text-gray-500">spent</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Budget Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Budget</p>
                  <p className="font-semibold text-gray-800">
                    {formatCurrency(budget.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Spent</p>
                  <p className="font-semibold text-orange-600">
                    {formatCurrency(progress.spent)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Left</p>
                  <p className="font-semibold text-green-600">
                    {formatCurrency(progress.remaining)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="float-card hover-lift glow-on-hover">
          <h3 className="text-lg font-bold gradient-text-primary mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/add-expense">
              <button className="glass-button-accent w-full p-4 text-left">
                <Plus className="w-6 h-6 mb-2" />
                <div className="font-semibold">Add Expense</div>
                <div className="text-xs opacity-80">Track spending</div>
              </button>
            </Link>
            <Link href="/reports">
              <button className="glass-button-secondary w-full p-4 text-left">
                <BarChart3 className="w-6 h-6 mb-2" />
                <div className="font-semibold">View Reports</div>
                <div className="text-xs opacity-80">Analytics</div>
              </button>
            </Link>
          </div>
        </div>

        {/* Recent Activity Summary */}
        <div className="float-card hover-lift glow-on-hover">
          <h3 className="text-lg font-bold gradient-text-primary mb-4">Today's Overview</h3>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">{expenses.length}</div>
              <div className="text-xs text-gray-600">Expenses</div>
            </div>
            <div className="text-center p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">
                {Object.keys(categoryTotals).length}
              </div>
              <div className="text-xs text-gray-600">Categories</div>
            </div>
            <div className="text-center p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Zap className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-lg font-bold text-gray-800">
                {budgetHealth}
              </div>
              <div className="text-xs text-gray-600">Health</div>
            </div>
          </div>

          {/* Top Categories */}
          {topCategories.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Top Spending</h4>
              <div className="space-y-2">
                {topCategories.slice(0, 3).map((category, index) => (
                  <div key={category.name} className="flex justify-between items-center p-2 bg-white/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-blue-500' : 
                        index === 1 ? 'bg-green-500' : 'bg-purple-500'
                      }`}></div>
                      <span className="text-sm font-medium text-gray-700">{category.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {formatCurrency(category.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 nav-glass-bottom p-4 z-30">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <Link href="/">
              <button className="nav-icon-active flex flex-col items-center gap-1">
                <BarChart3 className="w-6 h-6" />
                <span className="text-xs">Dashboard</span>
              </button>
            </Link>
            <Link href="/add-expense">
              <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                <Plus className="w-6 h-6" />
                <span className="text-xs">Add</span>
              </button>
            </Link>
            <Link href="/reports">
              <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                <TrendingUp className="w-6 h-6" />
                <span className="text-xs">Reports</span>
              </button>
            </Link>
            <Link href="/budget-settings">
              <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors">
                <DollarSign className="w-6 h-6" />
                <span className="text-xs">Budget</span>
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