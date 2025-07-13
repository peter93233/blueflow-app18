import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, DollarSign, Calendar, Save, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useFinance } from "@/hooks/use-finance";
import { BudgetPeriod } from "@/lib/finance-store";

export default function BudgetSettings() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { budget, setBudget, progress, saveCurrentMonth } = useFinance();
  
  const [selectedPeriod, setSelectedPeriod] = useState<BudgetPeriod>('weekly');
  const [budgetAmount, setBudgetAmount] = useState("");

  // Load existing budget on component mount
  useEffect(() => {
    if (budget) {
      setSelectedPeriod(budget.period);
      setBudgetAmount(budget.amount.toString());
    }
  }, [budget]);

  const periodOptions = [
    { value: 'weekly' as BudgetPeriod, label: 'Weekly', description: 'Set a weekly budget' },
    { value: 'biweekly' as BudgetPeriod, label: 'Biweekly', description: 'Set a biweekly budget' },
    { value: 'monthly' as BudgetPeriod, label: 'Monthly', description: 'Set a monthly budget' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleSaveBudget = () => {
    if (!budgetAmount || isNaN(parseFloat(budgetAmount))) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid budget amount",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(budgetAmount);
    setBudget(selectedPeriod, amount);
    
    toast({
      title: "Budget Updated",
      description: `${selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} budget of ${formatCurrency(amount)} saved successfully`,
    });
  };

  const handleArchiveMonth = () => {
    const archive = saveCurrentMonth();
    toast({
      title: "Month Archived",
      description: `${archive.month} data saved with ${formatCurrency(archive.totalExpenses)} in expenses`,
    });
  };

  const handleBack = () => {
    setLocation("/");
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
            <h1 className="text-xl font-bold text-[hsl(var(--blue-flow-700))]">Set Your Budget</h1>
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
          {/* Period Selection */}
          <motion.div
            className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <Label className="flex items-center gap-2 text-[hsl(var(--blue-flow-700))] font-semibold mb-4">
              <Calendar className="w-5 h-5" />
              Budget Period
            </Label>
            
            <div className="space-y-3">
              {periodOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  onClick={() => setSelectedPeriod(option.value)}
                  className={`w-full p-4 rounded-2xl transition-neuro ${
                    selectedPeriod === option.value
                      ? 'neuro-inset bg-gradient-to-br from-[hsl(var(--blue-flow-200))] to-[hsl(var(--blue-flow-300))]'
                      : 'neuro-shadow-sm bg-gradient-to-br from-[hsl(var(--blue-flow-100))] to-white hover:neuro-shadow'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                >
                  <div className="text-left">
                    <div className={`font-semibold ${
                      selectedPeriod === option.value 
                        ? 'text-[hsl(var(--blue-flow-700))]' 
                        : 'text-[hsl(var(--blue-flow-600))]'
                    }`}>
                      {option.label}
                    </div>
                    <div className={`text-sm ${
                      selectedPeriod === option.value 
                        ? 'text-[hsl(var(--blue-flow-600))]' 
                        : 'text-[hsl(var(--blue-flow-500))]'
                    }`}>
                      {option.description}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Budget Amount Input */}
          <motion.div
            className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <Label htmlFor="budget-amount" className="flex items-center gap-2 text-[hsl(var(--blue-flow-700))] font-semibold mb-4">
              <DollarSign className="w-5 h-5" />
              Enter Your Budget Amount
            </Label>
            
            <Input
              id="budget-amount"
              type="number"
              placeholder="0.00"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="rounded-2xl neuro-inset-sm border-0 bg-[hsl(var(--blue-flow-50))] text-[hsl(var(--blue-flow-700))] placeholder:text-[hsl(var(--blue-flow-400))] focus:ring-2 focus:ring-[hsl(var(--blue-flow-300))] text-xl text-center font-semibold py-6"
            />
            
            <div className="mt-3 text-center">
              <span className="text-sm text-[hsl(var(--blue-flow-500))]">
                {selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1)} budget limit
              </span>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <Button
              onClick={handleSaveBudget}
              className="glass-morphism rounded-2xl px-6 py-4 font-semibold text-[hsl(var(--blue-flow-700))] transition-neuro hover:shadow-lg active:scale-95 w-full border-0 bg-transparent hover:bg-transparent text-lg"
            >
              <motion.div 
                className="flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Save Budget</span>
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
}