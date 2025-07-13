import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, DollarSign, BarChart3, Archive, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArchiveManager, type ArchivedMonth } from "@/lib/archive-manager";

export default function ArchiveViewer() {
  const [archivedMonths, setArchivedMonths] = useState<ArchivedMonth[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<ArchivedMonth | null>(null);
  const [archiveSummary, setArchiveSummary] = useState<any>(null);

  // Load archived months on component mount
  useEffect(() => {
    loadArchivedData();
  }, []);

  const loadArchivedData = () => {
    const months = ArchiveManager.getArchivedMonths();
    setArchivedMonths(months);
    
    const summary = ArchiveManager.getArchiveSummary();
    setArchiveSummary(summary);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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

  const handleDeleteMonth = (key: string) => {
    if (confirm('Are you sure you want to delete this archived month? This action cannot be undone.')) {
      ArchiveManager.deleteArchivedMonth(key);
      loadArchivedData();
      setSelectedMonth(null);
    }
  };

  if (selectedMonth) {
    // Show detailed view for selected month
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 p-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 pt-4"
          >
            <button
              onClick={() => setSelectedMonth(null)}
              className="p-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">{selectedMonth.monthName}</h1>
          </motion.div>

          {/* Month Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-slate-800">Monthly Summary</h2>
              </div>
              <button
                onClick={() => handleDeleteMonth(selectedMonth.key)}
                className="p-2 hover:bg-red-100 rounded-full transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium text-slate-700">Total Spent</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{formatCurrency(selectedMonth.totalExpenses)}</p>
              </div>
              
              <div className="bg-white/30 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-slate-700">Transactions</span>
                </div>
                <p className="text-xl font-bold text-slate-800">{selectedMonth.expenseCount}</p>
              </div>
            </div>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Category Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(selectedMonth.categoryBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = selectedMonth.totalExpenses > 0 ? (amount / selectedMonth.totalExpenses) * 100 : 0;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
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
                      <div className="w-full bg-white/30 rounded-full h-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="h-2 rounded-full"
                          style={{ backgroundColor: getCategoryColor(category) }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </motion.div>

          {/* All Expenses */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-slate-800 mb-4">All Expenses ({selectedMonth.expenseCount})</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {selectedMonth.expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-white/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    />
                    <div>
                      <p className="font-medium text-slate-800">{expense.name}</p>
                      <p className="text-sm text-slate-600">{expense.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">{formatCurrency(expense.amount)}</p>
                    <p className="text-sm text-slate-600">{new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show archive list view
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
          <h1 className="text-2xl font-bold text-slate-800">📅 Past Months</h1>
        </motion.div>

        {/* Archive Summary */}
        {archiveSummary && archiveSummary.totalArchives > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl"
          >
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Archive Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/30 rounded-2xl p-3">
                <p className="text-sm text-slate-600">Total Archived</p>
                <p className="text-lg font-bold text-slate-800">{formatCurrency(archiveSummary.totalSpent)}</p>
              </div>
              <div className="bg-white/30 rounded-2xl p-3">
                <p className="text-sm text-slate-600">Avg Monthly</p>
                <p className="text-lg font-bold text-slate-800">{formatCurrency(archiveSummary.averageMonthlySpending)}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Archived Months List */}
        {archivedMonths.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/20 backdrop-blur-xl rounded-3xl p-8 border border-white/30 shadow-2xl text-center"
          >
            <Archive className="w-16 h-16 mx-auto mb-4 text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-800 mb-2">No Archived Months</h3>
            <p className="text-slate-600">Start using the "Save Current Month" feature to create your first archive!</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {archivedMonths.map((month, index) => (
              <motion.div
                key={month.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                onClick={() => setSelectedMonth(month)}
                className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 border border-white/30 shadow-2xl cursor-pointer hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">{month.monthName}</h3>
                      <p className="text-sm text-slate-600">
                        {month.expenseCount} transactions • Saved {new Date(month.savedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-slate-800">{formatCurrency(month.totalExpenses)}</p>
                    <p className="text-sm text-slate-600">Total Spent</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}