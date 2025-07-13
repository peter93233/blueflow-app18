import { motion } from "framer-motion";

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    glowColor: string;
  }>;
  size?: number;
  thickness?: number;
  className?: string;
}

export function VibrantDonutChart({ 
  data, 
  size = 120, 
  thickness = 12, 
  className = "" 
}: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let currentAngle = 0;
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Enhanced glow background */}
      <div 
        className="absolute inset-0 rounded-full opacity-30 blur-lg"
        style={{
          background: `conic-gradient(from 0deg, ${data.map(item => item.glowColor).join(', ')})`
        }}
      />
      
      {/* Main donut chart */}
      <svg width={size} height={size} className="relative z-10">
        <defs>
          {data.map((item, index) => (
            <radialGradient key={index} id={`gradient-${index}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={item.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={item.color} stopOpacity="1" />
            </radialGradient>
          ))}
        </defs>
        
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
          const strokeDashoffset = -((currentAngle / 360) * circumference);
          
          // Update angle for next segment
          const segmentAngle = (item.value / total) * 360;
          currentAngle += segmentAngle;
          
          return (
            <motion.circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={`url(#gradient-${index})`}
              strokeWidth={thickness}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="drop-shadow-lg"
              style={{
                filter: `drop-shadow(0 0 8px ${item.glowColor})`,
                transformOrigin: 'center',
                transform: 'rotate(-90deg)'
              }}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray }}
              transition={{ 
                duration: 1.5, 
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-bold text-gray-700">
            {data.length}
          </div>
          <div className="text-xs text-gray-500">
            Categories
          </div>
        </div>
      </div>
    </div>
  );
}

interface CategoryLegendProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
    glowColor: string;
  }>;
  total: number;
}

export function CategoryLegend({ data, total }: CategoryLegendProps) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {data.map((item, index) => (
        <motion.div
          key={index}
          className="flex items-center gap-2 p-2 rounded-lg bg-white/20 backdrop-blur-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{
              backgroundColor: item.color,
              boxShadow: `0 0 8px ${item.glowColor}`
            }}
          />
          <div className="flex-1">
            <div className="text-xs font-medium text-gray-700">{item.name}</div>
            <div className="text-xs text-gray-500">
              ${item.value.toFixed(0)} ({((item.value / total) * 100).toFixed(0)}%)
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}