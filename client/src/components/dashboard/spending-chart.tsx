import React from 'react';
import { motion } from 'framer-motion';
import { Doughnut } from 'react-chartjs-2';

interface SpendingChartProps {
  category: string;
  amount: string;
  percentage: number;
  color: string[];
  index: number;
}

export function SpendingChart({ category, amount, percentage, color, index }: SpendingChartProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '70%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
      delay: (index * 200) + 800
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        delay: 0.6 + index * 0.15, 
        duration: 0.5, 
        ease: "easeOut" 
      }}
      whileHover={{ 
        scale: 1.1, 
        transition: { duration: 0.2 }
      }}
      className="text-center"
    >
      <motion.div
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ 
          delay: 0.7 + index * 0.15, 
          duration: 0.8, 
          ease: "easeOut" 
        }}
        className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2"
      >
        <Doughnut
          data={{
            datasets: [{
              data: [percentage, 100 - percentage],
              backgroundColor: [color[0], '#f1f5f9'],
              borderWidth: 0
            }]
          }}
          options={chartOptions}
        />
      </motion.div>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 + index * 0.1, duration: 0.3 }}
        className="text-xs font-medium text-slate-800"
      >
        ${amount}
      </motion.p>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.0 + index * 0.1, duration: 0.3 }}
        className="text-xs text-slate-500"
      >
        {category}
      </motion.p>
    </motion.div>
  );
}