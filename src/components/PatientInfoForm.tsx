import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROCEDURES, Procedure } from "@/lib/constants";

interface PatientInfoFormProps {
  onProceed: (patientInfo: {
    name: string;
    age: string;
    procedure: Procedure;
  }) => void;
}

export const PatientInfoForm = ({ onProceed }: PatientInfoFormProps) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedProcedureId, setSelectedProcedureId] = useState<string>("");

  const handleProceed = () => {
    if (name && age && selectedProcedureId) {
      const procedure = PROCEDURES.find(p => p.id === selectedProcedureId);
      if (procedure) {
        onProceed({ name, age, procedure });
      }
    }
  };

  const isValid = name.trim() !== "" && age.trim() !== "" && selectedProcedureId !== "";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-5xl mx-auto px-4"
    >
      <div className="relative">
        {/* Main Content */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            Let's Begin Your
            <span className="block mt-2 bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Transformation Journey
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Enter a few details to visualize your personalized results
          </motion.p>
        </div>

        {/* Interactive Cards */}
        <div className="grid gap-6 md:gap-8 mb-10">
          {/* Patient Name */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="group"
          >
            <div className="glass-card rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                  👤
                </div>
                <Label htmlFor="patient-name" className="text-2xl md:text-3xl font-semibold m-0">
                  Patient Name
                </Label>
              </div>
              <Input
                id="patient-name"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background/50 border-2 h-14 text-lg rounded-xl transition-all duration-300 focus:border-primary focus:scale-[1.01]"
              />
            </div>
          </motion.div>

          {/* Patient Age */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="group"
          >
            <div className="glass-card rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                  🎂
                </div>
                <Label htmlFor="patient-age" className="text-2xl md:text-3xl font-semibold m-0">
                  Age
                </Label>
              </div>
              <Input
                id="patient-age"
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="bg-background/50 border-2 h-14 text-lg rounded-xl transition-all duration-300 focus:border-primary focus:scale-[1.01]"
              />
            </div>
          </motion.div>

          {/* Procedure Selection */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="group"
          >
            <div className="glass-card rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-2xl">
                  ⚕️
                </div>
                <Label htmlFor="procedure" className="text-2xl md:text-3xl font-semibold m-0">
                  Choose Your Procedure
                </Label>
              </div>
              <Select value={selectedProcedureId} onValueChange={setSelectedProcedureId}>
                <SelectTrigger id="procedure" className="bg-background/50 border-2 h-14 text-lg rounded-xl transition-all duration-300 focus:border-primary focus:scale-[1.01]">
                  <SelectValue placeholder="Select a procedure..." />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] rounded-xl">
                  {PROCEDURES.map((procedure) => (
                    <SelectItem key={procedure.id} value={procedure.id} className="text-base py-3">
                      <span className="flex items-center gap-3">
                        <span className="text-xl">{procedure.icon}</span>
                        <span>{procedure.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Button
            onClick={handleProceed}
            disabled={!isValid}
            size="lg"
            className="w-full h-16 rounded-2xl text-xl font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/30 disabled:scale-100 disabled:hover:shadow-none"
          >
            Continue to Photo Upload →
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};
