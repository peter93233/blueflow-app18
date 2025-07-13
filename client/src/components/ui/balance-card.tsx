import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { Button } from "./button";

interface BalanceCardProps {
  balance: number;
}

export default function BalanceCard({ balance }: BalanceCardProps) {
  const handleUpdateBalance = () => {
    console.log('Update Balance clicked');
    // TODO: Implement balance update functionality
  };

  return (
    <motion.div 
      className="mb-8"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow transition-neuro">
        <div className="text-center">
          <p className="text-sm font-medium text-[hsl(var(--blue-flow-600))] mb-2">Current Balance</p>
          <motion.h2 
            className="text-4xl font-bold text-[hsl(var(--blue-flow-700))] mb-6"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            ${balance.toLocaleString()}
          </motion.h2>
          
          <Button
            onClick={handleUpdateBalance}
            className="glass-morphism rounded-2xl px-6 py-3 font-semibold text-[hsl(var(--blue-flow-700))] transition-neuro hover:shadow-lg active:scale-95 w-full border-0 bg-transparent hover:bg-transparent"
          >
            <motion.div 
              className="flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Update Balance</span>
            </motion.div>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
