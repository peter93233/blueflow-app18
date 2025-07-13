import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BlueFlowLogo } from './blueflow-logo';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showShimmer, setShowShimmer] = useState(false);

  useEffect(() => {
    // Show shimmer effect after logo appears
    const shimmerTimer = setTimeout(() => {
      setShowShimmer(true);
    }, 800);

    // Complete splash screen after 2.5 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(shimmerTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 via-blue-50 to-cyan-50"
    >
      <div className="flex flex-col items-center space-y-8">
        {/* Logo Container with Glow Effect */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.2
          }}
          className="relative"
        >
          {/* Outer Glow Ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 via-blue-400/20 to-cyan-400/20 blur-xl"
            style={{ 
              width: '120px', 
              height: '120px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
          
          {/* Shimmer Effect */}
          {showShimmer && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0], scale: [0.8, 1.1, 0.8] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent blur-sm"
              style={{ 
                width: '100px', 
                height: '100px',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
          )}
          
          {/* Main Logo */}
          <BlueFlowLogo size={90} className="relative z-10" />
        </motion.div>

        {/* Welcome Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.8,
            ease: "easeOut"
          }}
          className="text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Welcome to BlueFlow
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
            className="text-slate-600 text-sm md:text-base font-medium"
          >
            Your Smart Budget Tracker
          </motion.p>
        </motion.div>

        {/* Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.3 }}
          className="flex space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Subtle Background Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-br from-purple-100/50 via-transparent to-blue-100/50"
      />
    </motion.div>
  );
}