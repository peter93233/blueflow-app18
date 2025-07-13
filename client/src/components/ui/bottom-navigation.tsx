import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutDashboard, DollarSign, Clock, BarChart3 } from "lucide-react";

type NavItem = 'dashboard' | 'budget' | 'history' | 'reports';

export default function BottomNavigation() {
  const [activeNav, setActiveNav] = useState<NavItem>('dashboard');

  const navItems = [
    { id: 'dashboard' as NavItem, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'budget' as NavItem, icon: DollarSign, label: 'Budget' },
    { id: 'history' as NavItem, icon: Clock, label: 'History' },
    { id: 'reports' as NavItem, icon: BarChart3, label: 'Reports' },
  ];

  const handleNavClick = (navId: NavItem) => {
    setActiveNav(navId);
    console.log(`Navigation clicked: ${navId}`);
    // TODO: Implement navigation routing
  };

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm">
      <motion.div 
        className="bg-gradient-to-r from-white/90 to-[hsl(var(--blue-flow-50))]/90 backdrop-blur-lg rounded-t-3xl px-6 py-4 neuro-shadow-lg border-t border-white/20"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex justify-around">
          {navItems.map((item, index) => {
            const isActive = activeNav === item.id;
            
            return (
              <motion.button
                key={item.id}
                className="flex flex-col items-center space-y-1 transition-neuro"
                onClick={() => handleNavClick(item.id)}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive 
                      ? 'bg-gradient-to-br from-[hsl(var(--blue-flow-400))] to-[hsl(var(--blue-flow-500))] neuro-shadow-sm' 
                      : 'bg-gradient-to-br from-[hsl(var(--blue-flow-100))] to-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  layout
                >
                  <item.icon 
                    className={`w-5 h-5 ${
                      isActive ? 'text-white' : 'text-[hsl(var(--blue-flow-600))]'
                    }`} 
                  />
                </motion.div>
                <span 
                  className={`text-xs font-medium ${
                    isActive 
                      ? 'text-[hsl(var(--blue-flow-700))] font-semibold' 
                      : 'text-[hsl(var(--blue-flow-500))]'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
}
