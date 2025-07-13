import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

export default function FloatingAIButton() {
  const handleAIClick = () => {
    console.log('AI Assistant clicked - placeholder functionality');
    // TODO: Implement AI Assistant functionality
  };

  return (
    <div className="fixed bottom-20 right-6 z-50">
      <motion.button
        className="w-14 h-14 glass-morphism-dark rounded-full flex items-center justify-center transition-neuro"
        onClick={handleAIClick}
        animate={{
          y: [0, -10, 0],
          opacity: 1,
          scale: 1
        }}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          },
          opacity: { delay: 1, duration: 0.5 },
          scale: { delay: 1, duration: 0.5 }
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
      >
        <Lightbulb className="w-7 h-7 text-white" />
      </motion.button>
    </div>
  );
}
