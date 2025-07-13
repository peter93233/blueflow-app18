import React from 'react';
import { motion } from 'framer-motion';

interface BlueFlowLogoProps {
  size?: number;
  className?: string;
  responsive?: boolean;
}

export function BlueFlowLogo({ size = 80, className = "", responsive = false }: BlueFlowLogoProps) {
  // Responsive sizing based on screen size
  const responsiveSize = responsive ? "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" : "";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative ${responsive ? responsiveSize : ''} ${className}`}
      style={responsive ? {} : { width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient definitions */}
        <defs>
          {/* Main bubble gradient */}
          <radialGradient id="bubbleGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.9)" />
            <stop offset="40%" stopColor="rgba(147, 197, 253, 0.7)" />
            <stop offset="70%" stopColor="rgba(167, 139, 250, 0.6)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.5)" />
          </radialGradient>
          
          {/* Compass gradient */}
          <linearGradient id="compassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          
          {/* Compass needle gradient */}
          <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          
          {/* Outer glow */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Inner shadow */}
          <filter id="innerShadow">
            <feOffset dx="0" dy="1"/>
            <feGaussianBlur stdDeviation="1" result="offset-blur"/>
            <feFlood floodColor="rgba(0,0,0,0.1)"/>
            <feComposite in2="offset-blur" operator="in"/>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer glow ring */}
        <motion.circle
          cx="40"
          cy="40"
          r="38"
          fill="none"
          stroke="url(#bubbleGradient)"
          strokeWidth="1"
          opacity="0.3"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
        
        {/* Main water bubble */}
        <motion.circle
          cx="40"
          cy="40"
          r="32"
          fill="url(#bubbleGradient)"
          filter="url(#glow)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />
        
        {/* Inner bubble highlight */}
        <motion.ellipse
          cx="34"
          cy="34"
          rx="8"
          ry="6"
          fill="rgba(255, 255, 255, 0.6)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        />
        
        {/* Compass outer ring */}
        <motion.circle
          cx="40"
          cy="40"
          r="18"
          fill="none"
          stroke="url(#compassGradient)"
          strokeWidth="1.5"
          strokeDasharray="2,2"
          opacity="0.8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        
        {/* Compass inner ring */}
        <motion.circle
          cx="40"
          cy="40"
          r="12"
          fill="none"
          stroke="url(#compassGradient)"
          strokeWidth="1"
          opacity="0.6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />
        
        {/* Compass needle (pointing north) */}
        <motion.g
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* North needle */}
          <path
            d="M40 28 L44 38 L40 36 L36 38 Z"
            fill="url(#needleGradient)"
            filter="url(#innerShadow)"
          />
          
          {/* South needle */}
          <path
            d="M40 52 L36 42 L40 44 L44 42 Z"
            fill="rgba(99, 102, 241, 0.7)"
            filter="url(#innerShadow)"
          />
          
          {/* East needle */}
          <path
            d="M52 40 L42 36 L44 40 L42 44 Z"
            fill="rgba(147, 197, 253, 0.8)"
            filter="url(#innerShadow)"
          />
          
          {/* West needle */}
          <path
            d="M28 40 L38 44 L36 40 L38 36 Z"
            fill="rgba(167, 139, 250, 0.8)"
            filter="url(#innerShadow)"
          />
        </motion.g>
        
        {/* Center dot */}
        <motion.circle
          cx="40"
          cy="40"
          r="3"
          fill="url(#compassGradient)"
          filter="url(#glow)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        />
        
        {/* Cardinal direction markers */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {/* N */}
          <text x="40" y="26" textAnchor="middle" fontSize="6" fill="url(#compassGradient)" fontWeight="bold">N</text>
          {/* S */}
          <text x="40" y="57" textAnchor="middle" fontSize="6" fill="url(#compassGradient)" fontWeight="bold">S</text>
          {/* E */}
          <text x="56" y="43" textAnchor="middle" fontSize="6" fill="url(#compassGradient)" fontWeight="bold">E</text>
          {/* W */}
          <text x="24" y="43" textAnchor="middle" fontSize="6" fill="url(#compassGradient)" fontWeight="bold">W</text>
        </motion.g>
      </svg>
      
      {/* Floating animation for the entire logo */}
      <motion.div
        className="absolute inset-0"
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}