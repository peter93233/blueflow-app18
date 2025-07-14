import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Calendar, Clock, RotateCcw } from 'lucide-react';
import { Button } from './button';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';

interface BudgetCycleSettingsProps {
  currentCycle: 'biweekly' | 'monthly' | 'six_months';
  autoResetEnabled: boolean;
  nextResetDate: Date;
  onUpdateSettings: (settings: {
    budgetCycle: 'biweekly' | 'monthly' | 'six_months';
    autoResetEnabled: boolean;
  }) => Promise<void>;
  onManualReset?: () => Promise<void>;
}

/**
 * Budget Cycle Settings Component
 * Allows users to configure their budget reset cycle and auto-reset preferences
 * Displays next reset date and provides manual reset option
 * Uses BlueFlow design with smooth animations and glass morphism
 */
export function BudgetCycleSettings({
  currentCycle,
  autoResetEnabled,
  nextResetDate,
  onUpdateSettings,
  onManualReset
}: BudgetCycleSettingsProps) {
  const [selectedCycle, setSelectedCycle] = useState<'biweekly' | 'monthly' | 'six_months'>(currentCycle);
  const [autoReset, setAutoReset] = useState(autoResetEnabled);
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Check for changes
  useEffect(() => {
    setHasChanges(
      selectedCycle !== currentCycle || autoReset !== autoResetEnabled
    );
  }, [selectedCycle, autoReset, currentCycle, autoResetEnabled]);

  // Handle settings update
  const handleUpdateSettings = async () => {
    if (!hasChanges) return;
    
    setIsUpdating(true);
    try {
      await onUpdateSettings({
        budgetCycle: selectedCycle,
        autoResetEnabled: autoReset,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle manual reset
  const handleManualReset = async () => {
    if (!onManualReset) return;
    
    setIsUpdating(true);
    try {
      await onManualReset();
    } catch (error) {
      console.error('Error during manual reset:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get cycle display name
  const getCycleDisplayName = (cycle: string) => {
    switch (cycle) {
      case 'biweekly': return 'Every 2 weeks';
      case 'monthly': return 'Monthly';
      case 'six_months': return 'Every 6 months';
      default: return cycle;
    }
  };

  // Format next reset date
  const formatResetDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate days until reset
  const getDaysUntilReset = (date: Date) => {
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilReset = getDaysUntilReset(nextResetDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center"
        >
          <Settings className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Budget Cycle Settings</h3>
          <p className="text-sm text-slate-600">Configure when your budget resets</p>
        </div>
      </div>

      {/* Current Status */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-slate-50/80 rounded-2xl p-4 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-600" />
            <div>
              <p className="text-sm font-medium text-slate-800">Next Reset</p>
              <p className="text-xs text-slate-600">{formatResetDate(nextResetDate)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800">
              {daysUntilReset > 0 ? `${daysUntilReset} days` : 'Today'}
            </p>
            <p className="text-xs text-slate-600">
              {daysUntilReset > 0 ? 'remaining' : 'reset due'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Settings Form */}
      <div className="space-y-6">
        {/* Budget Cycle Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Label htmlFor="budget-cycle" className="text-sm font-medium text-slate-700 mb-2 block">
            Budget Cycle
          </Label>
          <Select value={selectedCycle} onValueChange={(value: 'biweekly' | 'monthly' | 'six_months') => setSelectedCycle(value)}>
            <SelectTrigger className="bg-white/50 border-white/50">
              <SelectValue placeholder="Select budget cycle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="biweekly">Every 2 weeks</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="six_months">Every 6 months</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-500 mt-1">
            Your budget and data will reset automatically on this schedule
          </p>
        </motion.div>

        {/* Auto Reset Toggle */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <div className="flex-1">
            <Label htmlFor="auto-reset" className="text-sm font-medium text-slate-700">
              Auto Reset
            </Label>
            <p className="text-xs text-slate-500 mt-1">
              Automatically archive data and reset budget when the period ends
            </p>
          </div>
          <Switch
            id="auto-reset"
            checked={autoReset}
            onCheckedChange={setAutoReset}
            className="ml-4"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="flex gap-3 pt-4"
        >
          {/* Manual Reset Button */}
          {onManualReset && (
            <Button
              variant="outline"
              onClick={handleManualReset}
              disabled={isUpdating}
              className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Now
            </Button>
          )}

          {/* Save Settings Button */}
          <Button
            onClick={handleUpdateSettings}
            disabled={!hasChanges || isUpdating}
            className={`flex-1 ${
              hasChanges 
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700' 
                : 'bg-slate-300'
            } text-white`}
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Updating...
              </div>
            ) : hasChanges ? (
              'Save Changes'
            ) : (
              'No Changes'
            )}
          </Button>
        </motion.div>
      </div>

      {/* Info Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
        className="mt-6 p-4 bg-blue-50/80 rounded-2xl border border-blue-200/50"
      >
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-800">How Auto Reset Works</p>
            <p className="text-xs text-blue-600 mt-1">
              When your budget period ends, all expenses and incomes are saved to your Memory archive, 
              then your balance, budget, and transactions are reset for a fresh start.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}