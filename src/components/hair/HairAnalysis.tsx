import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TimelineSlider } from "./TimelineSlider";
import { NorwoodStageInfo } from "./NorwoodStageInfo";
import { HairAnalysisResult } from "@/lib/hair-types";

export const HairAnalysis = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<HairAnalysisResult | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const analyzeHair = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-hair", {
        body: { image: selectedImage },
      });

      if (error) throw error;

      setAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: `Classified as Norwood Stage ${data.norwoodStage}`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Upload Your Photo</h2>
            <p className="text-muted-foreground">
              Upload a clear front-facing photo for AI analysis
            </p>
          </div>

          {!selectedImage ? (
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-12 hover:border-primary/40 transition-colors">
              <label className="cursor-pointer block">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <div className="flex flex-col items-center gap-4">
                  <Upload className="w-12 h-12 text-primary" />
                  <div>
                    <p className="text-lg font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-sm text-muted-foreground">
                      JPG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <img
                src={selectedImage}
                alt="Uploaded"
                className="max-w-md mx-auto rounded-lg shadow-lg"
              />
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedImage(null);
                    setAnalysis(null);
                  }}
                >
                  Upload Different Photo
                </Button>
                {!analysis && (
                  <Button onClick={analyzeHair} disabled={isAnalyzing}>
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyze Hair Loss
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>

      <AnimatePresence>
        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <NorwoodStageInfo analysis={analysis} />
            <TimelineSlider
              analysis={analysis}
              originalImage={selectedImage!}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
