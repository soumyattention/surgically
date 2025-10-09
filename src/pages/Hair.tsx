import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { HairAnalysisNew } from "@/components/hair/HairAnalysisNew";

const Hair = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Hair Transplant Intelligence System
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced AI analysis using the Norwood-Hamilton Scale to classify hair loss 
              and simulate your month-by-month transplant journey
            </p>
          </div>
        </motion.div>

        <HairAnalysisNew />
      </div>
    </div>
  );
};

export default Hair;
