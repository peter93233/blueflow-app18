import { useState } from "react";
import { motion } from "framer-motion";
import BalanceCard from "@/components/ui/balance-card";
import BudgetCard from "@/components/ui/budget-card";
import QuickActions from "@/components/ui/quick-actions";
import BottomNavigation from "@/components/ui/bottom-navigation";
import FloatingAIButton from "@/components/ui/floating-ai-button";
import { User } from "lucide-react";

export default function Home() {
  const [balance] = useState(3200);
  const [budgetData] = useState({
    spent: 480,
    total: 650,
    period: "This Week",
    percentage: 74,
    remaining: 170
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
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
        {/* Status Bar placeholder for iOS */}
        <div className="h-6"></div>
        
        {/* App Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[hsl(var(--blue-flow-700))]">BlueFlow</h1>
            <p className="text-sm text-[hsl(var(--blue-flow-500))] font-medium">Personal Finance</p>
          </div>
          
          {/* Profile Avatar */}
          <motion.div 
            className="w-12 h-12 rounded-full neuro-shadow-sm bg-gradient-to-br from-[hsl(var(--blue-flow-100))] to-white flex items-center justify-center cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-6 h-6 text-[hsl(var(--blue-flow-600))]" />
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className="px-6 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <BalanceCard balance={balance} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <BudgetCard budgetData={budgetData} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <QuickActions />
        </motion.div>
      </motion.main>

      {/* Floating AI Assistant */}
      <FloatingAIButton />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
