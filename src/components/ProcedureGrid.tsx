import { motion } from "framer-motion";
import { PROCEDURES, Procedure } from "@/lib/constants";

interface ProcedureGridProps {
  selectedProcedure: Procedure | null;
  onProcedureSelect: (procedure: Procedure) => void;
}

export const ProcedureGrid = ({
  selectedProcedure,
  onProcedureSelect,
}: ProcedureGridProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="w-full max-w-6xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-4xl tracking-tighter font-geist mx-auto md:text-6xl mb-2 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">Select Procedure</h2>
        <p className="text-muted-foreground">
          Choose the surgical procedure to simulate
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {PROCEDURES.map((procedure, index) => (
          <motion.button
            key={procedure.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onProcedureSelect(procedure)}
            className={`glass-card rounded-2xl p-6 transition-smooth text-left ${
              selectedProcedure?.id === procedure.id
                ? "border-primary bg-primary/5 shadow-glow"
                : "border-border/50 hover:border-primary/50"
            }`}
          >
            <div className="flex flex-col items-start gap-3">
              <div className="text-4xl">{procedure.icon}</div>
              <div>
                <h3 className="font-semibold text-sm mb-1">{procedure.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {procedure.description}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
