import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "./button";
import { useLocation } from "wouter";

interface BudgetData {
  spent: number;
  total: number;
  period: string;
  percentage: number;
  remaining: number;
}

interface BudgetCardProps {
  budgetData: BudgetData;
}

export default function BudgetCard({ budgetData }: BudgetCardProps) {
  const [, setLocation] = useLocation();

  const handleAddExpense = () => {
    setLocation('/add-expense');
  };

  return (
    <motion.div 
      className="mb-8"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow transition-neuro">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[hsl(var(--blue-flow-700))]">Weekly Budget</h3>
          <span className="text-sm font-medium text-[hsl(var(--blue-flow-500))]">{budgetData.period}</span>
        </div>
        
        {/* Budget Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[hsl(var(--blue-flow-600))]">
              ${budgetData.spent} spent
            </span>
            <span className="text-sm font-medium text-[hsl(var(--blue-flow-500))]">
              of ${budgetData.total}
            </span>
          </div>
          <div className="w-full bg-[hsl(var(--blue-flow-100))] rounded-full h-3 neuro-inset">
            <motion.div 
              className="bg-gradient-to-r from-[hsl(var(--blue-flow-400))] to-[hsl(var(--blue-flow-500))] h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${budgetData.percentage}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-[hsl(var(--blue-flow-500))]">{budgetData.percentage}% used</span>
            <span className="text-xs text-[hsl(var(--blue-flow-500))]">${budgetData.remaining} left</span>
          </div>
        </div>
        
        <Button
          onClick={handleAddExpense}
          className="glass-morphism rounded-2xl px-6 py-3 font-semibold text-[hsl(var(--blue-flow-700))] transition-neuro hover:shadow-lg active:scale-95 w-full border-0 bg-transparent hover:bg-transparent"
        >
          <motion.div 
            className="flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Expense</span>
          </motion.div>
        </Button>
      </div>
    </motion.div>
  );
}
