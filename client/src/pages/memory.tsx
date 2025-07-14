import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Archive, 
  ChevronDown, 
  ChevronRight, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Receipt,
  Coins,
  BarChart3,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ResponsiveContainer } from '@/components/layout/responsive-container';

interface ArchiveEntry {
  id: number;
  periodType: string;
  startDate: string;
  endDate: string;
  initialBalance: number;
  finalBalance: number;
  totalExpenses: number;
  totalIncomes: number;
  netResult: number;
  expenseCount: number;
  incomeCount: number;
  archivedAt: string;
}

interface ArchiveDetail {
  id: number;
  type: 'expense' | 'income';
  name: string;
  amount: number;
  category?: string;
  source?: string;
  originalDate: string;
}

/**
 * Memory Page Component (also called Mnemosyne)
 * Displays chronological list of archived financial periods
 * Shows summary stats and allows expansion to view detailed transactions
 * Uses BlueFlow design with smooth animations and glass morphism
 */
export function MemoryPage() {
  const [archives, setArchives] = useState<ArchiveEntry[]>([]);
  const [expandedArchive, setExpandedArchive] = useState<number | null>(null);
  const [archiveDetails, setArchiveDetails] = useState<Record<number, ArchiveDetail[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState<Record<number, boolean>>({});

  // Load archives on component mount
  useEffect(() => {
    loadArchives();
  }, []);

  // Mock function to load archives (replace with actual API call)
  const loadArchives = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/archives/user/USER_ID');
      // const data = await response.json();
      // setArchives(data);
      
      // Mock data for development
      const mockArchives: ArchiveEntry[] = [
        {
          id: 1,
          periodType: 'monthly',
          startDate: '2024-12-01',
          endDate: '2024-12-31',
          initialBalance: 1000,
          finalBalance: 850,
          totalExpenses: 1250,
          totalIncomes: 1100,
          netResult: -150,
          expenseCount: 15,
          incomeCount: 3,
          archivedAt: '2025-01-01'
        },
        {
          id: 2,
          periodType: 'monthly',
          startDate: '2024-11-01',
          endDate: '2024-11-30',
          initialBalance: 800,
          finalBalance: 1000,
          totalExpenses: 950,
          totalIncomes: 1150,
          netResult: 200,
          expenseCount: 18,
          incomeCount: 4,
          archivedAt: '2024-12-01'
        }
      ];
      setArchives(mockArchives);
    } catch (error) {
      console.error('Error loading archives:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load archive details when expanded
  const loadArchiveDetails = async (archiveId: number) => {
    if (archiveDetails[archiveId]) return; // Already loaded
    
    setIsLoadingDetails(prev => ({ ...prev, [archiveId]: true }));
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/archive-details/archive/${archiveId}`);
      // const data = await response.json();
      // setArchiveDetails(prev => ({ ...prev, [archiveId]: data }));
      
      // Mock data for development
      const mockDetails: ArchiveDetail[] = [
        {
          id: 1,
          type: 'expense',
          name: 'Groceries',
          amount: 85.50,
          category: 'Food & Dining',
          originalDate: '2024-12-28'
        },
        {
          id: 2,
          type: 'income',
          name: 'Freelance Payment',
          amount: 500,
          source: 'Freelance',
          originalDate: '2024-12-27'
        },
        {
          id: 3,
          type: 'expense',
          name: 'Coffee Shop',
          amount: 12.75,
          category: 'Food & Dining',
          originalDate: '2024-12-26'
        }
      ];
      setArchiveDetails(prev => ({ ...prev, [archiveId]: mockDetails }));
    } catch (error) {
      console.error('Error loading archive details:', error);
    } finally {
      setIsLoadingDetails(prev => ({ ...prev, [archiveId]: false }));
    }
  };

  // Toggle archive expansion
  const toggleArchiveExpansion = (archiveId: number) => {
    if (expandedArchive === archiveId) {
      setExpandedArchive(null);
    } else {
      setExpandedArchive(archiveId);
      loadArchiveDetails(archiveId);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format period type for display
  const formatPeriodType = (type: string) => {
    switch (type) {
      case 'biweekly': return '2 Weeks';
      case 'monthly': return 'Monthly';
      case 'six_months': return '6 Months';
      default: return type;
    }
  };

  if (isLoading) {
    return (
      <ResponsiveContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading your financial memory...</p>
          </motion.div>
        </div>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center"
            >
              <Archive className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Memory</h1>
              <p className="text-sm text-slate-600">Your financial history archive</p>
            </div>
          </div>
          <p className="text-slate-600 max-w-lg mx-auto">
            View your past budget periods and track your financial journey over time.
          </p>
        </motion.div>

        {/* Archives List */}
        <div className="space-y-4">
          {archives.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center py-12"
            >
              <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">No Archives Yet</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Your financial periods will appear here once you complete your first budget cycle.
              </p>
            </motion.div>
          ) : (
            archives.map((archive, index) => (
              <motion.div
                key={archive.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="bg-white/70 backdrop-blur-xl border-white/50 shadow-lg overflow-hidden">
                  {/* Archive Summary */}
                  <div 
                    className="p-6 cursor-pointer hover:bg-white/20 transition-colors"
                    onClick={() => toggleArchiveExpansion(archive.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge variant="outline" className="bg-white/50">
                            {formatPeriodType(archive.periodType)}
                          </Badge>
                          <span className="text-sm text-slate-600">
                            {formatDate(archive.startDate)} - {formatDate(archive.endDate)}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                          {/* Net Result */}
                          <div className="flex items-center gap-2">
                            {archive.netResult >= 0 ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-red-600" />
                            )}
                            <div>
                              <p className="text-xs text-slate-500">Net Result</p>
                              <p className={`text-sm font-semibold ${
                                archive.netResult >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                ${Math.abs(archive.netResult).toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Total Expenses */}
                          <div className="flex items-center gap-2">
                            <Receipt className="w-4 h-4 text-red-500" />
                            <div>
                              <p className="text-xs text-slate-500">Expenses</p>
                              <p className="text-sm font-semibold text-slate-800">
                                ${archive.totalExpenses.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Total Incomes */}
                          <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-green-500" />
                            <div>
                              <p className="text-xs text-slate-500">Income</p>
                              <p className="text-sm font-semibold text-slate-800">
                                ${archive.totalIncomes.toFixed(2)}
                              </p>
                            </div>
                          </div>

                          {/* Transaction Count */}
                          <div className="flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-blue-500" />
                            <div>
                              <p className="text-xs text-slate-500">Transactions</p>
                              <p className="text-sm font-semibold text-slate-800">
                                {archive.expenseCount + archive.incomeCount}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <motion.div
                        animate={{ rotate: expandedArchive === archive.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Archive Details */}
                  <AnimatePresence>
                    {expandedArchive === archive.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-white/20"
                      >
                        <div className="p-6">
                          <h4 className="text-sm font-semibold text-slate-700 mb-4">
                            Transaction Details
                          </h4>
                          
                          {isLoadingDetails[archive.id] ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {archiveDetails[archive.id]?.map((detail, detailIndex) => (
                                <motion.div
                                  key={detail.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: detailIndex * 0.05, duration: 0.3 }}
                                  className="flex items-center justify-between p-3 bg-white/30 rounded-xl"
                                >
                                  <div className="flex items-center gap-3">
                                    {detail.type === 'expense' ? (
                                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                        <Receipt className="w-4 h-4 text-red-600" />
                                      </div>
                                    ) : (
                                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Coins className="w-4 h-4 text-green-600" />
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-sm font-medium text-slate-800">
                                        {detail.name}
                                      </p>
                                      <p className="text-xs text-slate-500">
                                        {detail.category || detail.source} • {formatDate(detail.originalDate)}
                                      </p>
                                    </div>
                                  </div>
                                  <p className={`text-sm font-semibold ${
                                    detail.type === 'expense' ? 'text-red-600' : 'text-green-600'
                                  }`}>
                                    {detail.type === 'expense' ? '-' : '+'}${detail.amount.toFixed(2)}
                                  </p>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </ResponsiveContainer>
  );
}