import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, DollarSign, Tag, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function AddExpense() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [expenseName, setExpenseName] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = [
    { value: "food", label: "Food" },
    { value: "transport", label: "Transport" },
    { value: "fun", label: "Fun" },
    { value: "other", label: "Other" }
  ];

  const handleSaveExpense = () => {
    if (!expenseName || !amount || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    console.log('Saving expense:', { expenseName, amount, category, date });
    toast({
      title: "Expense Added",
      description: `${expenseName} - $${amount} saved successfully`,
    });
    
    // Reset form
    setExpenseName("");
    setAmount("");
    setCategory("");
    setDate(new Date().toISOString().split('T')[0]);
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
            <h1 className="text-xl font-bold text-[hsl(var(--blue-flow-700))]">Add New Expense</h1>
          </div>
          
          <div className="w-12"></div>
        </div>
      </motion.header>

      {/* Form Content */}
      <motion.main 
        className="px-6 pb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-3xl p-6 neuro-shadow">
          <div className="space-y-6">
            {/* Expense Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Label htmlFor="expense-name" className="flex items-center gap-2 text-[hsl(var(--blue-flow-700))] font-semibold mb-2">
                <Type className="w-4 h-4" />
                Expense Name
              </Label>
              <Input
                id="expense-name"
                type="text"
                placeholder="e.g., Coffee, Gas, Movie"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
                className="rounded-2xl neuro-inset-sm border-0 bg-[hsl(var(--blue-flow-50))] text-[hsl(var(--blue-flow-700))] placeholder:text-[hsl(var(--blue-flow-400))] focus:ring-2 focus:ring-[hsl(var(--blue-flow-300))]"
              />
            </motion.div>

            {/* Amount */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Label htmlFor="amount" className="flex items-center gap-2 text-[hsl(var(--blue-flow-700))] font-semibold mb-2">
                <DollarSign className="w-4 h-4" />
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-2xl neuro-inset-sm border-0 bg-[hsl(var(--blue-flow-50))] text-[hsl(var(--blue-flow-700))] placeholder:text-[hsl(var(--blue-flow-400))] focus:ring-2 focus:ring-[hsl(var(--blue-flow-300))]"
              />
            </motion.div>

            {/* Category */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Label className="flex items-center gap-2 text-[hsl(var(--blue-flow-700))] font-semibold mb-2">
                <Tag className="w-4 h-4" />
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="rounded-2xl neuro-inset-sm border-0 bg-[hsl(var(--blue-flow-50))] text-[hsl(var(--blue-flow-700))] focus:ring-2 focus:ring-[hsl(var(--blue-flow-300))]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            {/* Date */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <Label htmlFor="date" className="flex items-center gap-2 text-[hsl(var(--blue-flow-700))] font-semibold mb-2">
                <Calendar className="w-4 h-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-2xl neuro-inset-sm border-0 bg-[hsl(var(--blue-flow-50))] text-[hsl(var(--blue-flow-700))] focus:ring-2 focus:ring-[hsl(var(--blue-flow-300))]"
              />
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              <Button
                onClick={handleSaveExpense}
                className="glass-morphism rounded-2xl px-6 py-4 font-semibold text-[hsl(var(--blue-flow-700))] transition-neuro hover:shadow-lg active:scale-95 w-full border-0 bg-transparent hover:bg-transparent text-lg"
              >
                <motion.div 
                  className="flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Save Expense</span>
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.main>
    </div>
  );
}