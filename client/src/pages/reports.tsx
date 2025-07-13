import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

type ReportView = 'weekly' | 'monthly';

export default function Reports() {
  const [, setLocation] = useLocation();
  const [activeView, setActiveView] = useState<ReportView>('weekly');

  const handleBack = () => {
    setLocation("/");
  };

  const handleViewChange = (view: ReportView) => {
    setActiveView(view);
    console.log(`Switched to ${view} view`);
  };

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
          {/* View Toggle */}
          <motion.div
            className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="flex space-x-4">
              {(['weekly', 'monthly'] as ReportView[]).map((view) => (
                <Button
                  key={view}
                  onClick={() => handleViewChange(view)}
                  className={`flex-1 rounded-2xl py-3 font-semibold transition-neuro border-0 ${
                    activeView === view
                      ? 'neuro-inset bg-gradient-to-br from-[hsl(var(--blue-flow-300))] to-[hsl(var(--blue-flow-400))] text-white'
                      : 'glass-morphism text-[hsl(var(--blue-flow-700))] bg-transparent hover:bg-transparent'
                  }`}
                >
                  <motion.span
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {view.charAt(0).toUpperCase() + view.slice(1)} View
                  </motion.span>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart Placeholder */}
          <motion.div
            className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--blue-flow-200))] to-[hsl(var(--blue-flow-300))] flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[hsl(var(--blue-flow-700))]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[hsl(var(--blue-flow-700))]">Spending Over Time</h3>
                <p className="text-sm text-[hsl(var(--blue-flow-500))]">{activeView.charAt(0).toUpperCase() + activeView.slice(1)} overview</p>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-48 bg-gradient-to-br from-[hsl(var(--blue-flow-100))] to-[hsl(var(--blue-flow-200))] rounded-2xl neuro-inset-sm flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-[hsl(var(--blue-flow-400))] mx-auto mb-3" />
                <p className="text-[hsl(var(--blue-flow-600))] font-medium">Bar Chart Placeholder</p>
                <p className="text-sm text-[hsl(var(--blue-flow-500))] mt-1">Spending trends will appear here</p>
              </div>
            </div>
          </motion.div>

          {/* Pie Chart Placeholder */}
          <motion.div
            className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(var(--blue-flow-200))] to-[hsl(var(--blue-flow-300))] flex items-center justify-center">
                <PieChart className="w-5 h-5 text-[hsl(var(--blue-flow-700))]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[hsl(var(--blue-flow-700))]">Category Breakdown</h3>
                <p className="text-sm text-[hsl(var(--blue-flow-500))]">Spending by category</p>
              </div>
            </div>
            
            {/* Chart Placeholder */}
            <div className="h-48 bg-gradient-to-br from-[hsl(var(--blue-flow-100))] to-[hsl(var(--blue-flow-200))] rounded-2xl neuro-inset-sm flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-12 h-12 text-[hsl(var(--blue-flow-400))] mx-auto mb-3" />
                <p className="text-[hsl(var(--blue-flow-600))] font-medium">Pie Chart Placeholder</p>
                <p className="text-sm text-[hsl(var(--blue-flow-500))] mt-1">Category breakdown will appear here</p>
              </div>
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
              <p className="text-xl font-bold text-[hsl(var(--blue-flow-700))] mt-1">$1,240</p>
            </div>
            
            <div className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-2xl p-4 neuro-shadow-sm text-center">
              <p className="text-sm text-[hsl(var(--blue-flow-500))] font-medium">Avg/Day</p>
              <p className="text-xl font-bold text-[hsl(var(--blue-flow-700))] mt-1">$41</p>
            </div>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}