import { useState, useEffect, useRef } from "react";
import { ArrowLeft, TrendingUp, PieChart, BarChart3, Calendar, Target, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { useFinance, useFinanceStats } from "@/hooks/use-finance";
import Chart from 'chart.js/auto';

type ReportView = 'weekly' | 'monthly';
type ChartType = 'line' | 'pie';

export default function Reports() {
  const { balance, budget, progress, expenses, categoryTotals } = useFinance();
  const { getTopCategories, getWeeklyTrend, getBudgetHealth } = useFinanceStats();
  const [currentView, setCurrentView] = useState<ReportView>('weekly');
  const [chartType, setChartType] = useState<ChartType>('line');
  
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartInstance = useRef<Chart | null>(null);
  const pieChartInstance = useRef<Chart | null>(null);

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Generate weekly trend data
  const weeklyData = getWeeklyTrend();
  const topCategories = getTopCategories(5);
  const budgetHealth = getBudgetHealth();

  // Chart colors with glassmorphic gradient
  const chartColors = [
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(6, 182, 212, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(168, 85, 247, 0.8)'
  ];

  const chartBorderColors = [
    'rgba(139, 92, 246, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(6, 182, 212, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(168, 85, 247, 1)'
  ];

  // Initialize line chart
  useEffect(() => {
    if (lineChartRef.current && chartType === 'line') {
      const ctx = lineChartRef.current.getContext('2d');
      
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }

      if (ctx) {
        lineChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: weeklyData.map(d => d.day),
            datasets: [{
              label: 'Daily Spending',
              data: weeklyData.map(d => d.amount),
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
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return '$' + value;
                  },
                  color: '#6b7280'
                },
                grid: {
                  color: 'rgba(107, 114, 128, 0.1)'
                }
              },
              x: {
                ticks: {
                  color: '#6b7280'
                },
                grid: {
                  color: 'rgba(107, 114, 128, 0.1)'
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
    };
  }, [weeklyData, chartType]);

  // Initialize pie chart
  useEffect(() => {
    if (pieChartRef.current && chartType === 'pie') {
      const ctx = pieChartRef.current.getContext('2d');
      
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }

      if (ctx && topCategories.length > 0) {
        pieChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: topCategories.map(cat => cat.name),
            datasets: [{
              data: topCategories.map(cat => cat.amount),
              backgroundColor: chartColors.slice(0, topCategories.length),
              borderColor: chartBorderColors.slice(0, topCategories.length),
              borderWidth: 2,
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true,
                  color: '#6b7280'
                }
              }
            },
            cutout: '60%'
          }
        });
      }
    }

    return () => {
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
    };
  }, [topCategories, chartType]);

  const handleViewChange = (view: ReportView) => {
    setCurrentView(view);
  };

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const averageDaily = totalSpent / 7; // Assuming weekly view

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
            <h1 className="text-xl font-bold gradient-text-primary">Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Financial insights</p>
          </div>
          <div className="w-12 h-12"></div> {/* Spacer */}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="float-card hover-lift glow-on-hover text-center">
            <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold gradient-text-primary">
              {formatCurrency(totalSpent)}
            </div>
            <p className="text-xs text-gray-600">Total Spent</p>
          </div>
          <div className="float-card hover-lift glow-on-hover text-center">
            <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold gradient-text-accent">
              {formatCurrency(averageDaily)}
            </div>
            <p className="text-xs text-gray-600">Daily Average</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="float-card hover-lift glow-on-hover mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold gradient-text-primary">View Controls</h3>
          </div>
          
          {/* Time Period Toggle */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handleViewChange('weekly')}
              className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all ${
                currentView === 'weekly'
                  ? 'bg-purple-500/20 border border-purple-500/50 text-purple-700'
                  : 'bg-white/20 border border-white/30 text-gray-700 hover:bg-white/40'
              }`}
            >
              <Calendar className="w-4 h-4 mx-auto mb-1" />
              Weekly
            </button>
            <button
              onClick={() => handleViewChange('monthly')}
              className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all ${
                currentView === 'monthly'
                  ? 'bg-purple-500/20 border border-purple-500/50 text-purple-700'
                  : 'bg-white/20 border border-white/30 text-gray-700 hover:bg-white/40'
              }`}
            >
              <Calendar className="w-4 h-4 mx-auto mb-1" />
              Monthly
            </button>
          </div>

          {/* Chart Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('line')}
              className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all ${
                chartType === 'line'
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-700'
                  : 'bg-white/20 border border-white/30 text-gray-700 hover:bg-white/40'
              }`}
            >
              <BarChart3 className="w-4 h-4 mx-auto mb-1" />
              Trend
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`flex-1 p-3 rounded-lg text-sm font-medium transition-all ${
                chartType === 'pie'
                  ? 'bg-blue-500/20 border border-blue-500/50 text-blue-700'
                  : 'bg-white/20 border border-white/30 text-gray-700 hover:bg-white/40'
              }`}
            >
              <PieChart className="w-4 h-4 mx-auto mb-1" />
              Categories
            </button>
          </div>
        </div>

        {/* Chart Container */}
        <div className="float-card hover-lift glow-on-hover mb-6">
          <div className="p-6">
            <h3 className="text-lg font-bold gradient-text-primary mb-4">
              {chartType === 'line' ? 'Spending Trend' : 'Category Breakdown'}
            </h3>
            <div className="chart-container-glass relative h-64">
              {chartType === 'line' ? (
                <canvas ref={lineChartRef} className="w-full h-full"></canvas>
              ) : (
                <canvas ref={pieChartRef} className="w-full h-full"></canvas>
              )}
            </div>
          </div>
        </div>

        {/* Category Details */}
        {topCategories.length > 0 && (
          <div className="float-card hover-lift glow-on-hover mb-6">
            <div className="p-6">
              <h3 className="text-lg font-bold gradient-text-primary mb-4">Top Categories</h3>
              <div className="space-y-3">
                {topCategories.map((category, index) => (
                  <div key={category.name} className="flex justify-between items-center p-3 bg-white/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: chartColors[index] }}
                      ></div>
                      <span className="font-medium text-gray-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">
                        {formatCurrency(category.amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round((category.amount / totalSpent) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Budget Health */}
        {budget && (
          <div className="float-card hover-lift glow-on-hover">
            <div className="p-6">
              <h3 className="text-lg font-bold gradient-text-primary mb-4">Budget Health</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-white/20 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">
                    {formatCurrency(budget.amount)}
                  </div>
                  <div className="text-xs text-gray-600">Budget</div>
                </div>
                <div className="text-center p-3 bg-white/20 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">
                    {formatCurrency(progress.spent)}
                  </div>
                  <div className="text-xs text-gray-600">Spent</div>
                </div>
                <div className="text-center p-3 bg-white/20 rounded-lg">
                  <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-lg font-bold text-gray-800">
                    {Math.round(progress.percentage)}%
                  </div>
                  <div className="text-xs text-gray-600">Used</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-white/20 rounded-lg text-center">
                <p className="text-sm font-medium text-gray-700">
                  Budget Status: <span className={`font-bold ${
                    progress.percentage < 50 ? 'text-green-600' :
                    progress.percentage < 80 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {budgetHealth}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}