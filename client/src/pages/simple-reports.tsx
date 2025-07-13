import { useState, useEffect, useRef } from "react";
import { ArrowLeft, TrendingUp, PieChart, BarChart3, Calendar, Target, DollarSign, LineChart } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

type ViewType = 'weekly' | 'monthly';

export default function SimpleReports() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<Record<string, number>>({});
  const [totalSpent, setTotalSpent] = useState(0);
  const [viewType, setViewType] = useState<ViewType>('weekly');
  const [spendingOverTime, setSpendingOverTime] = useState<{ labels: string[], data: number[] }>({ labels: [], data: [] });

  // Load expenses from localStorage and process chart data
  useEffect(() => {
    const storedExpenses = localStorage.getItem('blueflow_expenses');
    if (storedExpenses) {
      const parsedExpenses = JSON.parse(storedExpenses);
      setExpenses(parsedExpenses);
      
      // Calculate total spent
      const total = parsedExpenses.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
      setTotalSpent(total);
      
      // Calculate category totals
      const totals: Record<string, number> = {};
      parsedExpenses.forEach((expense: Expense) => {
        totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
      });
      setCategoryTotals(totals);
      
      // Process spending over time data
      processSpendingOverTime(parsedExpenses);
    }
  }, [viewType]);

  // Process spending data for line chart based on view type
  const processSpendingOverTime = (expenseData: Expense[]) => {
    const now = new Date();
    const daysToShow = viewType === 'weekly' ? 7 : 30;
    
    // Create array of dates for the chart
    const dates = [];
    const dailySpending = [];
    
    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dates.push(viewType === 'weekly' ? date.toLocaleDateString('en-US', { weekday: 'short' }) : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Calculate total spent on this date
      const dayTotal = expenseData
        .filter(expense => expense.date.startsWith(dateStr))
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      dailySpending.push(dayTotal);
    }
    
    setSpendingOverTime({ labels: dates, data: dailySpending });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // BlueFlow palette colors for categories
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Food: '#FFB5E8',
      Transport: '#FFC48C', 
      Entertainment: '#9FFFE0',
      Shopping: '#9E71E6',
      Bills: '#FFB5E8',
      Health: '#FFC48C',
      Other: '#9FFFE0'
    };
    return colors[category] || '#9E71E6';
  };

  // Chart.js configuration for line chart
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(100, 116, 139, 0.8)',
          callback: function(value: any) {
            return '$' + value;
          }
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(100, 116, 139, 0.8)',
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
    },
  };

  // Chart.js configuration for donut chart  
  const donutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '60%',
    animation: {
      animateRotate: true,
      duration: 2000,
    },
  };

  // Prepare data for line chart
  const lineChartData = {
    labels: spendingOverTime.labels,
    datasets: [
      {
        label: 'Daily Spending',
        data: spendingOverTime.data,
        borderColor: 'rgb(147, 51, 234)',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Prepare data for donut chart
  const donutChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: Object.keys(categoryTotals).map(category => getCategoryColor(category)),
        borderColor: 'rgba(255, 255, 255, 0.8)',
        borderWidth: 2,
      },
    ],
  };

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 pt-4"
        >
          <Link href="/">
            <button className="p-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">Your Financial Report</h1>
        </motion.div>

        {/* View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/20 backdrop-blur-xl rounded-2xl p-2 border border-white/30"
        >
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setViewType('weekly')}
              className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                viewType === 'weekly'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-white/40'
              }`}
            >
              Weekly View
            </button>
            <button
              onClick={() => setViewType('monthly')}
              className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                viewType === 'monthly'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-slate-700 hover:bg-white/40'
              }`}
            >
              Monthly View
            </button>
          </div>
        </motion.div>

        {/* Line Chart - Spending Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <LineChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Spending Over Time</h2>
              <p className="text-sm text-slate-600">
                {viewType === 'weekly' ? 'Last 7 days' : 'Last 30 days'} trend
              </p>
            </div>
          </div>

          {spendingOverTime.labels.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <LineChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No spending data available</p>
              <p className="text-sm">Start adding expenses to see trends!</p>
            </div>
          ) : (
            <div className="h-64">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          )}
        </motion.div>

        {/* Donut Chart - Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
              <PieChart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Category Breakdown</h2>
              <p className="text-sm text-slate-600">Where your money goes</p>
            </div>
          </div>

          {Object.keys(categoryTotals).length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No category data available</p>
              <p className="text-sm">Start adding expenses to see breakdown!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Donut Chart */}
              <div className="h-64">
                <Doughnut data={donutChartData} options={donutChartOptions} />
              </div>
              
              {/* Category Legend */}
              <div className="space-y-3">
                {Object.entries(categoryTotals)
                  .sort(([, a], [, b]) => b - a)
                  .map(([category, amount]) => {
                    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
                    return (
                      <div key={category} className="flex items-center justify-between p-2 bg-white/20 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: getCategoryColor(category) }}
                          />
                          <span className="font-medium text-slate-800">{category}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">{formatCurrency(amount)}</p>
                          <p className="text-sm text-slate-600">{percentage.toFixed(1)}%</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-slate-700">Total Spent</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{formatCurrency(totalSpent)}</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-xl rounded-2xl p-4 border border-white/30">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-slate-700">Transactions</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{expenses.length}</p>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Quick Stats</h2>
              <p className="text-sm text-slate-600">At a glance insights</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-white/30 rounded-xl">
              <span className="text-slate-600">Average per transaction:</span>
              <span className="font-semibold text-slate-800">
                {expenses.length > 0 ? formatCurrency(totalSpent / expenses.length) : '$0.00'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/30 rounded-xl">
              <span className="text-slate-600">Most expensive category:</span>
              <span className="font-semibold text-slate-800">
                {Object.keys(categoryTotals).length > 0 ? 
                  Object.entries(categoryTotals).sort(([, a], [, b]) => b - a)[0][0] : 'None'}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white/30 rounded-xl">
              <span className="text-slate-600">Total categories used:</span>
              <span className="font-semibold text-slate-800">{Object.keys(categoryTotals).length}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}