import React from 'react';
import { Link, useLocation } from 'wouter';
import { DollarSign, Plus, BarChart3, Settings, Archive } from 'lucide-react';

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', icon: DollarSign, label: 'Home' },
    { href: '/add-expense', icon: Plus, label: 'Add' },
    { href: '/reports', icon: BarChart3, label: 'Reports' },
    { href: '/memory', icon: Archive, label: 'Memory' },
    { href: '/budget-settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-white/30 z-30">
      <div className="max-w-md mx-auto flex justify-around py-3">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const IconComponent = item.icon;
          
          return (
            <Link key={item.href} href={item.href}>
              <button className={`flex flex-col items-center gap-1 px-2 py-2 transition-colors ${
                isActive 
                  ? 'text-purple-600' 
                  : 'text-slate-600 hover:text-purple-600'
              }`}>
                <IconComponent className="w-4 h-4" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}