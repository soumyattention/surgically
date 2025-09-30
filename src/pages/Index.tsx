import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PhotoUpload } from "@/components/PhotoUpload";
import { ProcedureGrid } from "@/components/ProcedureGrid";
import { LoadingState } from "@/components/LoadingState";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Procedure } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/ui/hero-section-dark";
import GalleryUpload from "@/components/GalleryUpload";

type Step = "upload" | "select" | "results";

const Index = () => {
  const [step, setStep] = useState<Step>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(
    null
  );
  const [beforeImageUrl, setBeforeImageUrl] = useState<string>("");
  const [afterImageUrl, setAfterImageUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handlePhotoSelected = (file: File) => {
    setSelectedFile(file);
    setBeforeImageUrl(URL.createObjectURL(file));
    setStep("select");
  };

  const handleProcedureSelect = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
  };

  const handleGenerate = async () => {
    if (!selectedFile || !selectedProcedure) return;

    setIsGenerating(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      await new Promise((resolve, reject) => {
        reader.onload = resolve;
        reader.onerror = reject;
      });

      const base64Image = reader.result as string;

      // Call the edge function
      const { data, error } = await supabase.functions.invoke("generate-simulation", {
        body: {
          imageData: base64Image,
          prompt: selectedProcedure.prompt,
        },
      });

      if (error) {
        console.error("Error generating simulation:", error);
        
        if (error.message?.includes("429")) {
          toast({
            title: "Rate limit exceeded",
            description: "Please wait a moment before trying again.",
            variant: "destructive",
          });
        } else if (error.message?.includes("402")) {
          toast({
            title: "Credits required",
            description: "Please add credits to continue using AI features.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Generation failed",
            description: "Unable to generate simulation. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      if (data?.imageUrl) {
        setAfterImageUrl(data.imageUrl);
        setStep("results");
        toast({
          title: "Success!",
          description: "Your surgical simulation is ready.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTryAnother = () => {
    setSelectedProcedure(null);
    setStep("select");
  };

  const handleUploadNew = () => {
    setSelectedFile(null);
    setSelectedProcedure(null);
    setBeforeImageUrl("");
    setAfterImageUrl("");
    setStep("upload");
  };

  return (
    <div className="min-h-screen">
      <HeroSection
        title="The last thing patients see before saying yes."
        subtitle={{
          regular: "The future of ",
          gradient: "surgical consultation",
          after: " is here.",
        }}
        description="Show patients their surgical results before they leave your office. Made for plastic surgeons, dermatologists, and aesthetic clinics."
        ctaButtons={[
          { text: "Try Surgically Now", href: "#dashboard", primary: true },
          { text: "View Showcase", href: "#showcase" }
        ]}
      />
      
      <div id="dashboard" className="bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
        <div className="container mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Surgically
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered surgical simulation for plastic surgeons and clinics.
            Show patients realistic before/after results instantly.
          </p>
        </motion.header>

        {/* Main Content */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {step === "upload" && (
              <PhotoUpload onPhotoSelected={handlePhotoSelected} />
            )}

            {step === "select" && (
              <motion.div
                key="select"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >
                {/* Preview */}
                {beforeImageUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-3xl p-4 max-w-md mx-auto"
                  >
                    <img
                      src={beforeImageUrl}
                      alt="Selected photo"
                      className="w-full rounded-2xl"
                    />
                  </motion.div>
                )}

                <ProcedureGrid
                  selectedProcedure={selectedProcedure}
                  onProcedureSelect={handleProcedureSelect}
                />

                {selectedProcedure && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center gap-4"
                  >
                    <Button
                      size="lg"
                      variant="secondary"
                      className="rounded-full px-8"
                      onClick={() => setStep("upload")}
                    >
                      Back
                    </Button>
                    <Button
                      size="lg"
                      className="rounded-full px-8 animate-glow"
                      onClick={handleGenerate}
                    >
                      Generate Simulation
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {step === "results" && (
              <BeforeAfterSlider
                beforeImage={beforeImageUrl}
                afterImage={afterImageUrl}
                onTryAnother={handleTryAnother}
                onUploadNew={handleUploadNew}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Gallery Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <GalleryUpload />
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 text-sm text-muted-foreground"
        >
          <p>
            Surgically uses advanced AI to provide surgical simulations for
            educational purposes.
          </p>
          <p className="mt-1">
            Results are approximations and should not replace professional
            medical consultation.
          </p>
        </motion.footer>
        </div>
      </div>

      <AnimatePresence>{isGenerating && <LoadingState />}</AnimatePresence>
    </div>
  );
};

export default Index;
