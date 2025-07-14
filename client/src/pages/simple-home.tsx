import { useState, useEffect } from "react";
import { LogOut, Mic, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { SimpleExpenseModal } from "@/components/ui/simple-expense-modal";
import { AddIncomeModal } from "@/components/ui/add-income-modal";
import { OnboardingTooltip } from "@/components/ui/onboarding-tooltip";
import { useOnboarding } from "@/hooks/use-onboarding";
import { OnboardingDataManager } from "@/lib/onboarding-data";
import { DataResetManager } from "@/lib/data-reset";
import { BlueFlowLogo } from "@/components/ui/blueflow-logo";
import FloatingAIButton from "@/components/ui/floating-ai-button";
import { BalanceCard } from "@/components/dashboard/balance-card";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { BudgetProgress } from "@/components/dashboard/budget-progress";
import { BottomNavigation } from "@/components/navigation/bottom-nav";
import { ResponsiveContainer } from "@/components/layout/responsive-container";
import { AIAssistant } from "@/lib/ai-assistant";
import { ArchiveManager } from "@/lib/archive-manager";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler);

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

export default function SimpleHome() {
  const { user, logout } = useAuth();
  const [balance, setBalance] = useState(0);
  const [showBalanceEdit, setShowBalanceEdit] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddIncomeModal, setShowAddIncomeModal] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);

  // Onboarding
  const {
    isNewUser,
    isActive: isOnboardingActive,
    currentStep,
    totalSteps,
    currentStepData,
    tooltipPosition,
    startOnboarding,
    nextStep,
    skipOnboarding,
    updateTooltipPosition
  } = useOnboarding();
  
  // Dynamic data for the design - will be populated from user's actual data
  const topWidgets = [
    { label: "Main Balance", amount: balance, color: "from-blue-400 to-blue-600" },
    { label: "Weekly Expenses", amount: totalSpent, color: "from-purple-400 to-purple-600" },
    { label: "Income from Salary", amount: 0, color: "from-green-400 to-green-600" }
  ];
  
  // Calculate spending by category from actual expenses
  const getSpendingByCategory = () => {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(expense => {
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    const colors = [
      ["#FF6B9D", "#C44569"],
      ["#4ECDC4", "#44A08D"], 
      ["#FFD93D", "#F39C12"],
      ["#6C7B7F", "#3B82F6"]
    ];
    
    return Object.entries(categoryTotals).map(([category, amount], index) => ({
      category,
      amount,
      color: colors[index % colors.length],
      percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
    }));
  };
  
  const weeklySpendingCharts = getSpendingByCategory();
  
  // Dynamic income data - will show actual user income data
  const getIncomeData = () => {
    // For now, return empty chart until income tracking is implemented
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Income',
        data: [0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4
      }]
    };
  };
  
  const incomeData = getIncomeData();

  // Load expenses and budget settings from localStorage
  useEffect(() => {
    const loadExpenses = () => {
      // Check if we should show demo data or real data
      if (OnboardingDataManager.isDemoDataActive()) {
        // Load demo data for display during onboarding
        const demoExpenses = OnboardingDataManager.getDemoExpenses();
        const demoBalance = OnboardingDataManager.getDemoBalance();
        
        if (demoExpenses.length > 0) {
          setExpenses(demoExpenses.map(exp => ({
            id: exp.id,
            name: exp.name,
            amount: exp.amount,
            category: exp.category,
            date: exp.date instanceof Date ? exp.date.toISOString().split('T')[0] : exp.date,
            createdAt: exp.createdAt instanceof Date ? exp.createdAt.toISOString() : exp.createdAt
          })));
          
          setBalance(demoBalance);
          setTotalSpent(demoExpenses.reduce((sum, expense) => sum + expense.amount, 0));
          setRemainingBudget(1000 - demoExpenses.reduce((sum, expense) => sum + expense.amount, 0));
        }
      } else {
        // For non-onboarding users, check if they have personal data
        if (!DataResetManager.hasPersonalData() && !isNewUser) {
          // Initialize fresh state for users without personal data
          DataResetManager.initializeFreshState();
        }
        
        // Load real data for existing users
        const storedExpenses = localStorage.getItem('blueflow_expenses');
        const storedBalance = localStorage.getItem('blueflow_balance');
        
        if (storedExpenses) {
          const parsedExpenses = JSON.parse(storedExpenses);
          setExpenses(parsedExpenses);
          
          // Calculate total spent
          const total = parsedExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
          setTotalSpent(total);
          
          // Calculate remaining budget
          const budget = parseFloat(localStorage.getItem('blueflow_budget_amount') || '0');
          setRemainingBudget(budget - total);
        }
        
        if (storedBalance) {
          setBalance(parseFloat(storedBalance));
        }
      }
    };

    loadExpenses();
    
    // Initialize demo notifications only during onboarding
    initializeDemoNotifications();
    
    // Listen for expense additions
    const handleExpenseAdded = () => {
      loadExpenses();
    };
    
    window.addEventListener('expenseAdded', handleExpenseAdded);
    return () => window.removeEventListener('expenseAdded', handleExpenseAdded);
  }, [isNewUser]);

  // Start onboarding for new users
  useEffect(() => {
    if (isNewUser && !isOnboardingActive) {
      // Delay to ensure DOM is ready
      const timer = setTimeout(() => {
        startOnboarding();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isNewUser, isOnboardingActive, startOnboarding]);

  // Update tooltip positions when current step changes
  useEffect(() => {
    if (isOnboardingActive && currentStepData) {
      updateTooltipPosition(currentStepData.targetElement);
    }
  }, [currentStep, isOnboardingActive, currentStepData, updateTooltipPosition]);

  const initializeDemoNotifications = () => {
    // Only add welcome notification for new users during onboarding
    if (isNewUser && OnboardingDataManager.isDemoDataActive()) {
      const existingNotifications = AIAssistant.getRecentNotifications();
      if (existingNotifications.length === 0) {
        AIAssistant.addNotification({
          type: 'balance_update',
          title: 'Welcome to BlueFlow',
          message: 'Your AI assistant is ready to help with financial insights!',
          read: false,
          icon: '✅'
        });
      }
    }
  };

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

  const getBudgetColor = (percentage: number) => {
    if (percentage <= 50) return 'from-green-400 to-green-500';
    if (percentage <= 75) return 'from-yellow-400 to-yellow-500';
    if (percentage <= 85) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  const handleSaveMonth = () => {
    const savedMonth = ArchiveManager.saveCurrentMonth();
    if (savedMonth) {
      // Add notification about successful archive
      AIAssistant.addNotification({
        type: 'achievement',
        title: 'Month Archived Successfully',
        message: `${savedMonth.monthName} saved with ${savedMonth.expenseCount} transactions totaling ${formatCurrency(savedMonth.totalExpenses)}`,
        read: false,
        icon: '🎉'
      });
      
      alert(`Month saved! ${savedMonth.monthName} has been archived with ${savedMonth.expenseCount} transactions totaling ${formatCurrency(savedMonth.totalExpenses)}`);
      
      // Refresh the page to show cleared expenses
      window.location.reload();
    } else {
      alert('No expenses to archive. Add some expenses first!');
    }
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    cutout: '70%'
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#334155',
        bodyColor: '#334155',
        borderColor: '#e2e8f0',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    },
    elements: {
      point: {
        radius: 0
      }
    }
  };

  return (
    <ResponsiveContainer>
      <div className="space-y-4 sm:space-y-6">
        {/* Header with BlueFlow Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8 pb-6 relative"
        >
          {/* Custom BlueFlow Logo */}
          <div className="flex justify-center mb-4">
            <BlueFlowLogo size={75} responsive={true} />
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            BlueFlow
          </h1>
          <p className="text-slate-600 text-sm font-medium">Smart Budget Tracker</p>
          
          {/* Welcome message and logout button */}
          <div className="absolute top-8 right-4 flex items-center gap-2">
            <span className="text-sm text-slate-600">
              Welcome, {user?.name || user?.email}
            </span>
            <button
              onClick={logout}
              className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Top Balance Widgets */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4"
        >
          {topWidgets.map((widget, index) => (
            <BalanceCard
              key={index}
              title={widget.label}
              amount={widget.amount.toString()}
              index={index}
            />
          ))}
        </motion.div>

        {/* Weekly Spending */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Spending by Category</h3>
            <div className="flex gap-2">
              <span className="text-xs text-slate-400">
                {totalSpent > 0 ? `$${totalSpent.toFixed(2)} total` : 'No expenses yet'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {weeklySpendingCharts.length > 0 ? (
              weeklySpendingCharts.map((chart, index) => (
                <SpendingChart
                  key={index}
                  category={chart.category}
                  amount={chart.amount.toString()}
                  percentage={chart.percentage}
                  color={chart.color}
                  index={index}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-slate-400">
                <p className="text-sm">Add expenses to see category breakdown</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Income Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Income Breakdown</h3>
            <div className="flex gap-2">
              <span className="text-xs text-slate-400">No income data yet</span>
            </div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scaleY: 0.3 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ 
              delay: 0.8, 
              duration: 0.8, 
              ease: "easeOut" 
            }}
            className="h-32 mb-4"
          >
            <Line 
              data={incomeData} 
              options={{
                ...lineChartOptions,
                animation: {
                  duration: 1200,
                  delay: 1000,
                  easing: 'easeInOutQuart'
                }
              }} 
            />
          </motion.div>
          
          <div className="flex justify-center text-xs text-slate-400">
            <span>Start tracking income to see breakdown</span>
          </div>
        </motion.div>

        {/* Smart Budget Track */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Smart Budget Track</h3>
          
          <BudgetProgress
            currentAmount={totalSpent.toFixed(2)}
            totalBudget={Math.max(remainingBudget + totalSpent, 100).toFixed(2)}
            percentage={totalSpent > 0 && (remainingBudget + totalSpent) > 0 ? Math.round((totalSpent / (remainingBudget + totalSpent)) * 100) : 0}
            onAddExpense={() => setShowAddExpenseModal(true)}
          />
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-3">
                <p className="text-green-700 font-medium">${remainingBudget.toFixed(2)} LEFT</p>
                <p className="text-green-600 text-xs">Monthly</p>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-3">
                <p className="text-blue-700 font-medium">${totalSpent.toFixed(2)} SPENT</p>
                <p className="text-blue-600 text-xs">This Period</p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-3">
                <p className="text-purple-700 font-medium">{expenses.length} ITEMS</p>
                <p className="text-purple-600 text-xs">Transactions</p>
              </div>
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-3">
                <p className="text-orange-700 font-medium">${balance.toFixed(2)}</p>
                <p className="text-orange-600 text-xs">Balance</p>
              </div>
            </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3 mb-4"
        >
          <button
            id="add-expense-button"
            onClick={() => setShowAddExpenseModal(true)}
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <span className="text-sm font-medium">Add Expense</span>
          </button>
          
          <button
            id="add-income-button"
            onClick={() => setShowAddIncomeModal(true)}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Add Income</span>
          </button>
        </motion.div>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* Floating AI Button */}
        <FloatingAIButton />

        {/* Add Expense Modal */}
        <SimpleExpenseModal 
          isOpen={showAddExpenseModal} 
          onClose={() => setShowAddExpenseModal(false)} 
        />

        {/* Add Income Modal */}
        <AddIncomeModal
          isOpen={showAddIncomeModal}
          onClose={() => setShowAddIncomeModal(false)}
          onAddIncome={(income) => {
            // TODO: Handle income addition
            console.log('Income added:', income);
            // For now, just close the modal
            setShowAddIncomeModal(false);
          }}
        />

        {/* Onboarding Tooltip */}
        {isOnboardingActive && currentStepData && (
          <OnboardingTooltip
            isVisible={true}
            title={currentStepData.title}
            description={currentStepData.description}
            step={currentStep + 1}
            totalSteps={totalSteps}
            position={tooltipPosition}
            onNext={nextStep}
            onSkip={skipOnboarding}
            isLastStep={currentStep === totalSteps - 1}
          />
        )}
        
      </div>
    </ResponsiveContainer>
  );
}