import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Button } from './button';

interface OnboardingTooltipProps {
  isVisible: boolean;
  title: string;
  description: string;
  step: number;
  totalSteps: number;
  position: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };
  onNext: () => void;
  onSkip: () => void;
  isLastStep?: boolean;
}

export function OnboardingTooltip({
  isVisible,
  title,
  description,
  step,
  totalSteps,
  position,
  onNext,
  onSkip,
  isLastStep = false
}: OnboardingTooltipProps) {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 pointer-events-none">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
          onClick={onSkip}
        />
        
        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="absolute pointer-events-auto"
          style={{
            top: position.top,
            left: position.left,
            right: position.right,
            bottom: position.bottom,
          }}
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/50 max-w-xs">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {step}
                </div>
                <span className="text-xs text-slate-500">{step} of {totalSteps}</span>
              </div>
              <button
                onClick={onSkip}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onSkip}
                className="flex-1"
              >
                Skip Tour
              </Button>
              <Button
                onClick={onNext}
                size="sm"
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0"
              >
                {isLastStep ? 'Finish' : 'Next'}
                {!isLastStep && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </div>

          {/* Arrow pointer */}
          <div 
            className="absolute w-3 h-3 bg-white/95 rotate-45 border border-white/50"
            style={{
              top: position.top !== undefined ? '-6px' : 'auto',
              bottom: position.bottom !== undefined ? '-6px' : 'auto',
              left: '50%',
              transform: 'translateX(-50%) rotate(45deg)',
              borderTopColor: position.bottom !== undefined ? 'transparent' : undefined,
              borderLeftColor: position.bottom !== undefined ? 'transparent' : undefined,
              borderBottomColor: position.top !== undefined ? 'transparent' : undefined,
              borderRightColor: position.top !== undefined ? 'transparent' : undefined,
            }}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}