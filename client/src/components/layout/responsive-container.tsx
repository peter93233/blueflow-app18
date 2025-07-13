import React, { ReactNode } from 'react';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
}

export function ResponsiveContainer({ children, className = '' }: ResponsiveContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 via-blue-50 to-cyan-50 ${className}`}>
      <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-4xl mx-auto px-4 py-4">
        {children}
        {/* Bottom Navigation Spacer */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}