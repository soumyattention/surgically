import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROCEDURES, Procedure } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

const patientInfoSchema = z.object({
  name: z.string()
    .trim()
    .min(1, "Patient name is required")
    .max(100, "Patient name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Patient name can only contain letters, spaces, hyphens, and apostrophes"),
  procedureId: z.string().min(1, "Please select a procedure")
});

interface PatientInfoFormProps {
  onProceed: (patientInfo: {
    name: string;
    procedure: Procedure;
  }) => void;
  initialName?: string;
  initialProcedure?: Procedure | null;
}

export const PatientInfoForm = ({ onProceed, initialName = "", initialProcedure = null }: PatientInfoFormProps) => {
  const [name, setName] = useState(initialName);
  const [selectedProcedureId, setSelectedProcedureId] = useState<string>(initialProcedure?.id || "");
  const { toast } = useToast();

  const handleProceed = () => {
    try {
      const validated = patientInfoSchema.parse({
        name,
        procedureId: selectedProcedureId
      });

      const procedure = PROCEDURES.find(p => p.id === validated.procedureId);
      if (procedure) {
        onProceed({ name: validated.name, procedure });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Invalid input",
          description: error.errors[0].message,
          variant: "destructive"
        });
      }
    }
  };

  const isValid = name.trim() !== "" && selectedProcedureId !== "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-card rounded-3xl p-8 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl tracking-tighter font-geist mx-auto md:text-6xl mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Patient Information
          </h2>
          <p className="text-muted-foreground">
            Enter patient details to begin the simulation
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-name">Patient Name</Label>
            <Input
              id="patient-name"
              placeholder="Enter patient name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="procedure">Surgical Procedure</Label>
            <Select value={selectedProcedureId} onValueChange={setSelectedProcedureId}>
              <SelectTrigger id="procedure" className="bg-background/50">
                <SelectValue placeholder="Select a procedure" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {PROCEDURES.map((procedure) => (
                  <SelectItem key={procedure.id} value={procedure.id}>
                    <span className="flex items-center gap-2">
                      <span>{procedure.icon}</span>
                      <span>{procedure.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleProceed}
          disabled={!isValid}
          size="lg"
          className="w-full rounded-full"
        >
          Proceed to Upload Photos
        </Button>
      </div>
    </motion.div>
  );
};
