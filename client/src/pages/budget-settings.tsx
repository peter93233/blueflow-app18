import { useState } from "react";
import { ArrowLeft, DollarSign, Calendar, Target, Settings, Save } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useFinance } from "@/hooks/use-finance";
import { BudgetPeriod } from "@/lib/finance-store";
import { useNotifications } from "@/hooks/use-notifications";

export default function BudgetSettings() {
  const [, setLocation] = useLocation();
  const { budget, setBudget, progress } = useFinance();
  const { showToast } = useNotifications();
  
  const [budgetAmount, setBudgetAmount] = useState(budget?.amount.toString() || "");
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod>(budget?.period || 'weekly');

  const formatCurrency = (amount: string) => {
    if (!amount) return "";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const handleSaveBudget = () => {
    if (!budgetAmount || isNaN(parseFloat(budgetAmount))) {
      showToast({
        type: 'budget_exceeded',
        title: 'Invalid Amount',
        message: 'Please enter a valid budget amount',
        priority: 'medium',
        icon: '⚠️'
      });
      return;
    }

    const amount = parseFloat(budgetAmount);
    setBudget(selectedPeriod, amount);
    
    showToast({
      type: 'smart_tip',
      title: 'Budget Updated!',
      message: `Your ${selectedPeriod} budget has been set to ${formatCurrency(budgetAmount)}`,
      priority: 'medium',
      icon: '✅'
    });

    setLocation("/");
  };

  const budgetPeriods: { value: BudgetPeriod; label: string; description: string }[] = [
    { value: 'weekly', label: 'Weekly', description: 'Reset every Monday' },
    { value: 'biweekly', label: 'Bi-weekly', description: 'Reset every 2 weeks' },
    { value: 'monthly', label: 'Monthly', description: 'Reset on 1st of month' }
  ];

  const quickAmounts = [100, 200, 500, 1000];

  // Calculate daily/weekly targets based on period
  const getDailyTarget = () => {
    if (!budgetAmount) return 0;
    const amount = parseFloat(budgetAmount);
    switch (selectedPeriod) {
      case 'weekly': return amount / 7;
      case 'biweekly': return amount / 14;
      case 'monthly': return amount / 30;
      default: return 0;
    }
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
            <h1 className="text-xl font-bold gradient-text-primary">Budget Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your spending limits</p>
          </div>
          <div className="w-12 h-12"></div> {/* Spacer */}
        </div>

        {/* Budget Preview Card */}
        {budgetAmount && (
          <div className="float-card text-center hover-lift glow-on-hover mb-6">
            <div className="p-6">
              <Target className="w-10 h-10 text-purple-500 mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text-accent mb-2">
                {formatCurrency(budgetAmount)}
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} Budget
              </p>
              <div className="text-xs text-gray-500">
                Daily target: {formatCurrency(getDailyTarget().toString())}
              </div>
            </div>
          </div>
        )}

        {/* Budget Amount */}
        <div className="float-card hover-lift glow-on-hover mb-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="w-6 h-6 text-green-500" />
              <h3 className="text-lg font-bold gradient-text-primary">Budget Amount</h3>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700">
                Set your {selectedPeriod} spending limit
              </label>
              <input
                type="number"
                step="0.01"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="glass-input w-full text-2xl font-bold text-center"
                placeholder="0.00"
                required
              />
            </div>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-3">
              {quickAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setBudgetAmount(amount.toString())}
                  className="p-3 text-sm font-semibold text-gray-700 bg-white/20 rounded-lg hover:bg-white/40 transition-all border border-white/30"
                >
                  ${amount}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Period */}
        <div className="float-card hover-lift glow-on-hover mb-6">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-bold gradient-text-primary">Budget Period</h3>
            </div>

            <div className="space-y-3">
              {budgetPeriods.map((period) => (
                <button
                  key={period.value}
                  onClick={() => setSelectedPeriod(period.value)}
                  className={`w-full p-4 rounded-lg text-left transition-all border ${
                    selectedPeriod === period.value
                      ? 'bg-purple-500/20 border-purple-500/50 text-purple-700'
                      : 'bg-white/20 border-white/30 text-gray-700 hover:bg-white/40'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{period.label}</div>
                      <div className="text-sm opacity-80">{period.description}</div>
                    </div>
                    {selectedPeriod === period.value && (
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Current Budget Status */}
        {budget && (
          <div className="float-card hover-lift glow-on-hover mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-orange-500" />
                <h3 className="text-lg font-bold gradient-text-primary">Current Budget</h3>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/20 rounded-lg">
                  <div className="text-lg font-bold text-gray-800">
                    {formatCurrency(budget.amount.toString())}
                  </div>
                  <div className="text-xs text-gray-600">Set Budget</div>
                </div>
                <div className="text-center p-3 bg-white/20 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">
                    {formatCurrency(progress.spent.toString())}
                  </div>
                  <div className="text-xs text-gray-600">Spent</div>
                </div>
                <div className="text-center p-3 bg-white/20 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(progress.remaining.toString())}
                  </div>
                  <div className="text-xs text-gray-600">Remaining</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progress.percentage)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Budget Tips */}
        <div className="float-card hover-lift mb-6">
          <div className="p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              💡 Budget Tips
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Set realistic budgets based on your income</p>
              <p>• Weekly budgets help with short-term planning</p>
              <p>• Monitor spending regularly to stay on track</p>
              <p>• Adjust your budget as your needs change</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveBudget}
          className="glass-button-primary w-full py-4 text-lg font-semibold hover-lift"
        >
          <Save className="w-5 h-5 mr-2" />
          Save Budget Settings
        </button>
      </div>
    </div>
  );
}