import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const LoadingState = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div className="glass-card rounded-3xl p-12 max-w-md text-center">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-flex p-6 rounded-2xl bg-primary/10 text-primary mb-6"
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>

        <h3 className="text-2xl font-semibold mb-3">
          Generating Simulation
        </h3>
        <p className="text-muted-foreground mb-6">
          Our AI is creating a realistic visualization of the surgical results.
          This may take a moment...
        </p>

        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 rounded-full bg-primary"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
