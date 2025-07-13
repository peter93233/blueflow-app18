import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, PieChart, Calendar, Filter, BarChart3, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useFinance, useFinanceStats } from "@/hooks/use-finance";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

type ReportView = 'weekly' | 'monthly';
type ChartType = 'line' | 'pie';

export default function Reports() {
  const [, setLocation] = useLocation();
  const [selectedView, setSelectedView] = useState<ReportView>('weekly');
  const [chartType, setChartType] = useState<ChartType>('line');
  const { expenses, categoryTotals, balance } = useFinance();
  const { getTopCategories, getWeeklyTrend, getMonthlyTrend } = useFinanceStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Generate line chart data
  const generateLineChartData = () => {
    const isWeekly = selectedView === 'weekly';
    
    if (isWeekly) {
      // Weekly data - last 7 days
      const dates = [];
      const amounts = [];
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        
        // Calculate spending for this day
        const dayExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.toDateString() === date.toDateString();
        });
        
        const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        amounts.push(dayTotal);
      }
      
      return {
        labels: dates,
        datasets: [
          {
            label: 'Daily Spending',
            data: amounts,
            borderColor: 'rgba(139, 92, 246, 1)',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(139, 92, 246, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      };
    } else {
      // Monthly data - last 4 weeks
      const weeks = [];
      const amounts = [];
      const today = new Date();
      
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - (i * 7 + 6));
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() - (i * 7));
        
        weeks.push(`Week ${4 - i}`);
        
        // Calculate spending for this week
        const weekExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= weekStart && expenseDate <= weekEnd;
        });
        
        const weekTotal = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        amounts.push(weekTotal);
      }
      
      return {
        labels: weeks,
        datasets: [
          {
            label: 'Weekly Spending',
            data: amounts,
            borderColor: 'rgba(244, 114, 182, 1)',
            backgroundColor: 'rgba(244, 114, 182, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(244, 114, 182, 1)',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8,
          },
        ],
      };
    }
  };

  // Generate pie chart data
  const generatePieChartData = () => {
    const topCategories = getTopCategories(6);
    
    if (topCategories.length === 0) {
      return {
        labels: ['No Data'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['rgba(229, 231, 235, 0.8)'],
            borderColor: ['rgba(156, 163, 175, 1)'],
            borderWidth: 2,
          },
        ],
      };
    }

    const colors = [
      'rgba(139, 92, 246, 0.8)',   // Purple
      'rgba(244, 114, 182, 0.8)',  // Pink
      'rgba(6, 182, 212, 0.8)',    // Cyan
      'rgba(251, 191, 36, 0.8)',   // Amber
      'rgba(34, 197, 94, 0.8)',    // Green
      'rgba(239, 68, 68, 0.8)',    // Red
    ];

    const borderColors = [
      'rgba(139, 92, 246, 1)',
      'rgba(244, 114, 182, 1)',
      'rgba(6, 182, 212, 1)',
      'rgba(251, 191, 36, 1)',
      'rgba(34, 197, 94, 1)',
      'rgba(239, 68, 68, 1)',
    ];

    return {
      labels: topCategories.map(cat => cat.category),
      datasets: [
        {
          data: topCategories.map(cat => cat.amount),
          backgroundColor: colors.slice(0, topCategories.length),
          borderColor: borderColors.slice(0, topCategories.length),
          borderWidth: 2,
          hoverOffset: 10,
        },
      ],
    };
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: 'rgba(139, 92, 246, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `Spent: ${formatCurrency(context.parsed.y)}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        border: {
          display: false,
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12,
          },
          callback: (value: any) => formatCurrency(value),
        },
      },
    },
    animation: {
      duration: 1000,
      easing: 'easeInOutCubic',
    },
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#374151',
          font: {
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: 'rgba(139, 92, 246, 0.2)',
        borderWidth: 1,
        cornerRadius: 12,
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : '0';
            return `${context.label}: ${formatCurrency(context.parsed)} (${percentage}%)`;
          },
        },
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      easing: 'easeInOutCubic',
    },
  };

  const handleViewChange = (view: ReportView) => {
    setSelectedView(view);
  };

  const handleBack = () => {
    setLocation("/");
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryCount = Object.keys(categoryTotals).length;

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gradient-to-br from-[hsl(var(--blue-flow-50))] to-[hsl(var(--blue-flow-100))] relative overflow-hidden">
      {/* Header */}
      <motion.header 
        className="pt-12 pb-6 px-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="h-6"></div>
        
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={handleBack}
            className="w-12 h-12 rounded-full neuro-shadow-sm bg-gradient-to-br from-[hsl(var(--blue-flow-100))] to-white flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6 text-[hsl(var(--blue-flow-600))]" />
          </motion.button>
          
          <div className="text-center">
            <h1 className="text-xl font-bold text-[hsl(var(--blue-flow-700))]">Financial Report</h1>
          </div>
          
          <div className="w-12"></div>
        </div>
      </motion.header>

      {/* Content */}
      <motion.main 
        className="px-6 pb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="space-y-6">
          {/* Chart Type Toggle */}
          <motion.div
            className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="flex space-x-4">
              {(['line', 'pie'] as ChartType[]).map((type) => (
                <Button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`flex-1 rounded-2xl py-3 font-semibold transition-neuro border-0 ${
                    chartType === type
                      ? 'neuro-inset bg-gradient-to-br from-[hsl(var(--blue-flow-300))] to-[hsl(var(--blue-flow-400))] text-white'
                      : 'glass-morphism text-[hsl(var(--blue-flow-700))] bg-transparent hover:bg-transparent'
                  }`}
                >
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2"
                  >
                    {type === 'line' ? <LineChart className="w-4 h-4" /> : <PieChart className="w-4 h-4" />}
                    {type === 'line' ? 'Trend' : 'Categories'}
                  </motion.span>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Time Period Toggle (only for line chart) */}
          {chartType === 'line' && (
            <motion.div
              className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <div className="flex space-x-4">
                {(['weekly', 'monthly'] as ReportView[]).map((view) => (
                  <Button
                    key={view}
                    onClick={() => handleViewChange(view)}
                    className={`flex-1 rounded-2xl py-3 font-semibold transition-neuro border-0 ${
                      selectedView === view
                        ? 'neuro-inset bg-gradient-to-br from-[hsl(var(--blue-flow-300))] to-[hsl(var(--blue-flow-400))] text-white'
                        : 'glass-morphism text-[hsl(var(--blue-flow-700))] bg-transparent hover:bg-transparent'
                    }`}
                  >
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {view.charAt(0).toUpperCase() + view.slice(1)}
                    </motion.span>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chart Display */}
          <motion.div
            className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--blue-flow-200))] to-[hsl(var(--blue-flow-300))] flex items-center justify-center">
                {chartType === 'line' ? 
                  <BarChart3 className="w-5 h-5 text-[hsl(var(--blue-flow-700))]" /> :
                  <PieChart className="w-5 h-5 text-[hsl(var(--blue-flow-700))]" />
                }
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[hsl(var(--blue-flow-700))]">
                  {chartType === 'line' 
                    ? `${selectedView === 'weekly' ? 'Weekly' : 'Monthly'} Spending Trend`
                    : 'Category Breakdown'
                  }
                </h3>
                <p className="text-sm text-[hsl(var(--blue-flow-500))]">
                  {chartType === 'line' ? 'Spending over time' : 'Spending by category'}
                </p>
              </div>
            </div>
            
            {/* Chart Container */}
            <div className="h-80 bg-gradient-to-br from-[hsl(var(--blue-flow-100))] to-[hsl(var(--blue-flow-200))] rounded-2xl neuro-inset-sm p-4">
              {chartType === 'line' ? (
                <Line data={generateLineChartData()} options={lineChartOptions} />
              ) : (
                <Doughnut data={generatePieChartData()} options={pieChartOptions} />
              )}
            </div>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <div className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-2xl p-4 neuro-shadow-sm text-center">
              <p className="text-sm text-[hsl(var(--blue-flow-500))] font-medium">Total Spent</p>
              <p className="text-xl font-bold text-[hsl(var(--blue-flow-700))] mt-1">{formatCurrency(totalSpent)}</p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-2xl p-4 neuro-shadow-sm text-center">
              <p className="text-sm text-[hsl(var(--blue-flow-500))] font-medium">Categories</p>
              <p className="text-xl font-bold text-[hsl(var(--blue-flow-700))] mt-1">{categoryCount}</p>
            </div>
          </motion.div>

          {/* Insights Card */}
          <motion.div
            className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <h4 className="font-semibold text-[hsl(var(--blue-flow-700))] mb-3">Quick Insights</h4>
            <div className="space-y-2 text-sm text-[hsl(var(--blue-flow-600))]">
              {expenses.length === 0 ? (
                <p>Add some expenses to see spending insights!</p>
              ) : (
                <>
                  <p>• Total expenses: {expenses.length} transactions</p>
                  <p>• Average per transaction: {formatCurrency(totalSpent / expenses.length)}</p>
                  {categoryCount > 0 && (
                    <p>• Most used category: {getTopCategories(1)[0]?.category || 'None'}</p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}