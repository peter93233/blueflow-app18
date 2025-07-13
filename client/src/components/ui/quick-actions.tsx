import { motion } from "framer-motion";
import { BarChart3, Target } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      icon: BarChart3,
      label: "Analytics",
      onClick: () => console.log('Analytics clicked')
    },
    {
      icon: Target,
      label: "Goals",
      onClick: () => console.log('Goals clicked')
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-4 mb-8">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          className="bg-gradient-to-br from-white to-[hsl(var(--blue-flow-50))] rounded-2xl p-4 neuro-shadow-sm transition-neuro hover:neuro-shadow cursor-pointer"
          whileHover={{ y: -2, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
        >
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[hsl(var(--blue-flow-200))] to-[hsl(var(--blue-flow-300))] flex items-center justify-center">
              <action.icon className="w-6 h-6 text-[hsl(var(--blue-flow-700))]" />
            </div>
            <p className="text-sm font-semibold text-[hsl(var(--blue-flow-700))]">{action.label}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
