import { useState, useEffect } from "react";
import { DollarSign, Plus, Edit3, PieChart, BarChart3, Settings, Target, Zap, Archive, Mic } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { SimpleExpenseModal } from "@/components/ui/simple-expense-modal";
import { ExpenseDisplay } from "@/components/ui/expense-display";
import FloatingAIButton from "@/components/ui/floating-ai-button";
import { ArchiveManager } from "@/lib/archive-manager";
import { AIAssistant } from "@/lib/ai-assistant";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

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
  const [balance, setBalance] = useState(3200);
  const [showBalanceEdit, setShowBalanceEdit] = useState(false);
  const [newBalance, setNewBalance] = useState("");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(500);
  
  // Mock data for the new design
  const topWidgets = [
    { label: "Main Balance", amount: 442.05, color: "from-blue-400 to-blue-600" },
    { label: "Weekly Expenses", amount: 118.86, color: "from-purple-400 to-purple-600" },
    { label: "Income from Salary", amount: 520.00, color: "from-green-400 to-green-600" }
  ];
  
  const weeklySpendingCharts = [
    { category: "Food", amount: 89.50, color: ["#FF6B9D", "#C44569"], percentage: 35 },
    { category: "Transport", amount: 45.20, color: ["#4ECDC4", "#44A08D"], percentage: 20 },
    { category: "Entertainment", amount: 67.30, color: ["#FFD93D", "#F39C12"], percentage: 25 },
    { category: "Shopping", amount: 123.80, color: ["#6C7B7F", "#3B82F6"], percentage: 45 }
  ];
  
  const incomeData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Income',
      data: [2800, 3200, 2900, 3400, 3100, 3600],
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  // Load expenses and budget settings from localStorage
  useEffect(() => {
    const loadExpenses = () => {
      const storedExpenses = localStorage.getItem('blueflow_expenses');
      if (storedExpenses) {
        const parsedExpenses = JSON.parse(storedExpenses);
        setExpenses(parsedExpenses);
        
        // Calculate total spent
        const total = parsedExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
        setTotalSpent(total);
        
        // Calculate remaining budget
        const budget = parseFloat(localStorage.getItem('blueflow_budget_amount') || '500');
        setRemainingBudget(budget - total);
      }
    };

    loadExpenses();
    
    // Initialize demo notifications
    initializeDemoNotifications();
    
    // Listen for expense additions
    const handleExpenseAdded = () => {
      loadExpenses();
    };
    
    window.addEventListener('expenseAdded', handleExpenseAdded);
    return () => window.removeEventListener('expenseAdded', handleExpenseAdded);
  }, []);

  const initializeDemoNotifications = () => {
    const existingNotifications = AIAssistant.getRecentNotifications();
    if (existingNotifications.length === 0) {
      // Add some demo notifications
      AIAssistant.addNotification({
        type: 'balance_update',
        title: 'Welcome to BlueFlow',
        message: 'Your AI assistant is ready to help with financial insights!',
        read: false,
        icon: '✅'
      });
      
      AIAssistant.addNotification({
        type: 'monthly_reminder',
        title: 'Monthly Archive Tip',
        message: 'Remember to save your current month when you want to start fresh!',
        read: false,
        icon: '💡'
      });
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 via-blue-50 to-cyan-50 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header with BlueFlow Logo */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center pt-8 pb-6"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            BlueFlow
          </h1>
          <p className="text-slate-600 text-sm font-medium">Smart Budget Tracker</p>
        </motion.div>

        {/* Top Balance Widgets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mt-4"
        >
          {topWidgets.map((widget, index) => (
            <div key={index} className="bg-white/70 backdrop-blur-xl rounded-2xl p-4 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">${widget.amount}</p>
                <p className="text-xs text-slate-600 mt-1 font-medium">{widget.label}</p>
              </div>
            </div>
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
            <h3 className="text-lg font-semibold text-slate-800">Weekly Spending</h3>
            <div className="flex gap-2">
              <span className="text-xs text-purple-500">$2,842.50</span>
              <span className="text-xs text-blue-500">$4,160.00</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            {weeklySpendingCharts.map((chart, index) => (
              <div key={index} className="text-center">
                <div className="relative w-16 h-16 mx-auto mb-2">
                  <Doughnut
                    data={{
                      datasets: [{
                        data: [chart.percentage, 100 - chart.percentage],
                        backgroundColor: [chart.color[0], '#f1f5f9'],
                        borderWidth: 0
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
                <p className="text-xs font-medium text-slate-800">${chart.amount}</p>
                <p className="text-xs text-slate-500">{chart.category}</p>
              </div>
            ))}
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
              <span className="text-xs text-purple-500">$2,911.43</span>
              <span className="text-xs text-orange-500">$3,184.00</span>
            </div>
          </div>
          
          <div className="h-32 mb-4">
            <Line data={incomeData} options={lineChartOptions} />
          </div>
          
          <div className="flex justify-between text-xs text-slate-500">
            <span>$0-$1,000</span>
            <span>$1,000-$2,000</span>
            <span>$2,000-$3,000</span>
            <span>$3,000-$4,000</span>
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
          
          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-slate-800">$610.00</p>
            
            <div className="mt-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Mic className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gradient-to-r from-green-100 to-green-200 rounded-lg p-3">
                <p className="text-green-700 font-medium">$3,535.00 SAVED</p>
                <p className="text-green-600 text-xs">Monthly</p>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg p-3">
                <p className="text-blue-700 font-medium">$2,547.00 SAVED</p>
                <p className="text-blue-600 text-xs">Weekly</p>
              </div>
              <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg p-3">
                <p className="text-purple-700 font-medium">$4,456.00 SAVED</p>
                <p className="text-purple-600 text-xs">Daily</p>
              </div>
              <div className="bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg p-3">
                <p className="text-orange-700 font-medium">$2,365.00 SAVED</p>
                <p className="text-orange-600 text-xs">Hourly</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/30">
          <div className="max-w-md mx-auto flex justify-around py-3">
            <Link href="/">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-purple-600">
                <DollarSign className="w-5 h-5" />
                <span className="text-xs font-medium">Home</span>
              </button>
            </Link>
            <Link href="/add-expense">
              <button className="flex flex-col items-center gap-1 px-4 py-2 text-slate-600 hover:text-purple-600 transition-colors">
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

        {/* Floating AI Button */}
        <FloatingAIButton />

        {/* Add Expense Modal */}
        <SimpleExpenseModal 
          isOpen={showAddExpenseModal} 
          onClose={() => setShowAddExpenseModal(false)} 
        />
        
        {/* Bottom Navigation Spacer */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}