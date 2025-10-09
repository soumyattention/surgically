import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PhotoUpload } from "./PhotoUpload";
import { AnalysisDisplay } from "./AnalysisDisplay";
import { TimelineSlider } from "./TimelineSlider";
import { HairAnalysisResult, GraftEstimate, GeneratedImages } from "@/lib/hair-types";
import { calculateGrafts } from "@/lib/hair-calculations";
import { LoadingState } from "@/components/LoadingState";

interface UploadedPhotos {
  front?: File;
  top?: File;
  side?: File;
}

interface PhotoPreviews {
  front: string | null;
  top: string | null;
  side: string | null;
}

export const HairAnalysisNew = () => {
  const [photos, setPhotos] = useState<UploadedPhotos>({});
  const [previews, setPreviews] = useState<PhotoPreviews>({
    front: null,
    top: null,
    side: null,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<HairAnalysisResult | null>(null);
  const [graftEstimate, setGraftEstimate] = useState<GraftEstimate | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImages>({
    month0: "",
    month3: null,
    month6: null,
    month9: null,
    month12: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingMonth, setGeneratingMonth] = useState<number | null>(null);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = (type: "front" | "top" | "side", file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be under 10MB",
        variant: "destructive",
      });
      return;
    }

    setPhotos((prev) => ({ ...prev, [type]: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoRemove = (type: "front" | "top" | "side") => {
    setPhotos((prev) => {
      const newPhotos = { ...prev };
      delete newPhotos[type];
      return newPhotos;
    });
    setPreviews((prev) => ({ ...prev, [type]: null }));
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!photos.front) {
      toast({
        title: "Front photo required",
        description: "Please upload at least a front view photo",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const frontBase64 = await fileToBase64(photos.front);
      const topBase64 = photos.top ? await fileToBase64(photos.top) : undefined;

      // Step 1: Analyze hair loss
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke(
        "analyze-hair",
        {
          body: {
            frontImage: frontBase64,
            topImage: topBase64,
          },
        }
      );

      if (analysisError) throw analysisError;

      const analysisResult = analysisData as HairAnalysisResult;
      setAnalysis(analysisResult);

      // Step 2: Calculate grafts
      const grafts = calculateGrafts(
        analysisResult.norwoodStage,
        analysisResult.hairCharacteristics
      );
      setGraftEstimate(grafts);

      // Set month 0 image
      setGeneratedImages((prev) => ({ ...prev, month0: frontBase64 }));

      // Show the generate button
      setShowGenerateButton(true);

      toast({
        title: "Analysis Complete",
        description: `Classified as Norwood Stage ${analysisResult.norwoodStage}. Click "Generate Timeline" to create simulation images.`,
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  const handleGenerateTimeline = () => {
    if (!analysis || !graftEstimate || !generatedImages.month0) return;
    generateAllImages(generatedImages.month0, analysis, graftEstimate.total);
  };

  const generateAllImages = async (
    frontImage: string,
    analysis: HairAnalysisResult,
    totalGrafts: number
  ) => {
    setIsGenerating(true);
    setShowGenerateButton(false);
    setGeneratingMonth(12);

    try {
      // Generate Month 12 first (final result)
      const { data: month12Data, error: month12Error } = await supabase.functions.invoke(
        "generate-hair-final",
        {
          body: {
            beforeImage: frontImage,
            norwoodStage: analysis.norwoodStage,
            totalGrafts,
            hairColor: analysis.hairCharacteristics.color,
            hairTexture: analysis.hairCharacteristics.texture,
          },
        }
      );

      if (month12Error) {
        console.error("Month 12 generation error:", month12Error);
        throw month12Error;
      }

      setGeneratedImages((prev) => ({ ...prev, month12: month12Data.imageUrl }));

      // Generate intermediate stages using Month 12 as reference
      const months = [3, 6, 9] as const;
      for (const month of months) {
        setGeneratingMonth(month);
        
        const { data, error } = await supabase.functions.invoke(
          "generate-hair-timeline",
          {
            body: {
              beforeImage: frontImage,
              afterImage: month12Data.imageUrl,
              month,
              norwoodStage: analysis.norwoodStage,
              totalGrafts,
            },
          }
        );

        if (error) {
          console.error(`Month ${month} generation error:`, error);
          throw error;
        }

        setGeneratedImages((prev) => ({
          ...prev,
          [`month${month}`]: data.imageUrl,
        }));
      }

      toast({
        title: "Timeline Generated",
        description: "All growth stages have been simulated",
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate timeline images. You can view the analysis results below.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setGeneratingMonth(null);
    }
  };

  const handleRegenerate = async (month: 3 | 6 | 9 | 12) => {
    if (!analysis || !graftEstimate) return;

    setGeneratingMonth(month);

    try {
      if (month === 12) {
        const { data, error } = await supabase.functions.invoke(
          "generate-hair-final",
          {
            body: {
              beforeImage: generatedImages.month0,
              norwoodStage: analysis.norwoodStage,
              totalGrafts: graftEstimate.total,
              hairColor: analysis.hairCharacteristics.color,
              hairTexture: analysis.hairCharacteristics.texture,
            },
          }
        );

        if (error) throw error;
        setGeneratedImages((prev) => ({ ...prev, month12: data.imageUrl }));
      } else {
        const { data, error } = await supabase.functions.invoke(
          "generate-hair-timeline",
          {
            body: {
              beforeImage: generatedImages.month0,
              afterImage: generatedImages.month12,
              month,
              norwoodStage: analysis.norwoodStage,
              totalGrafts: graftEstimate.total,
            },
          }
        );

        if (error) throw error;
        setGeneratedImages((prev) => ({
          ...prev,
          [`month${month}`]: data.imageUrl,
        }));
      }

      toast({
        title: "Regenerated",
        description: `Month ${month} image has been regenerated`,
      });
    } catch (error) {
      console.error("Regeneration error:", error);
      toast({
        title: "Regeneration Failed",
        description: "Unable to regenerate image",
        variant: "destructive",
      });
    } finally {
      setGeneratingMonth(null);
    }
  };

  return (
    <div className="space-y-8">
      {(isAnalyzing || isGenerating) && <LoadingState />}
      
      <Card className="p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Upload Patient Photos</h2>
            <p className="text-muted-foreground">
              Upload clear photos for AI-powered Norwood classification and graft estimation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PhotoUpload
              type="front"
              required={true}
              preview={previews.front}
              onUpload={(file) => handlePhotoUpload("front", file)}
              onRemove={() => handlePhotoRemove("front")}
            />
            <PhotoUpload
              type="top"
              required={false}
              preview={previews.top}
              onUpload={(file) => handlePhotoUpload("top", file)}
              onRemove={() => handlePhotoRemove("top")}
            />
            <PhotoUpload
              type="side"
              required={false}
              preview={previews.side}
              onUpload={(file) => handlePhotoUpload("side", file)}
              onRemove={() => handlePhotoRemove("side")}
            />
          </div>

          <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-lg">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
            <p className="text-sm text-muted-foreground">
              For best results, ensure photos are clear, well-lit, and show the entire scalp area from the specified angle.
            </p>
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={!photos.front || isAnalyzing || isGenerating}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Hair Loss...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze & Generate Timeline
              </>
            )}
          </Button>
        </div>
      </Card>

      <AnimatePresence>
        {analysis && graftEstimate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <AnalysisDisplay analysis={analysis} graftEstimate={graftEstimate} />

            {showGenerateButton && !isGenerating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="p-6">
                  <div className="text-center space-y-4">
                    <h3 className="text-xl font-semibold">Ready to Generate Timeline</h3>
                    <p className="text-muted-foreground">
                      Generate photorealistic simulations showing hair growth progression over 12 months
                    </p>
                    <Button
                      onClick={handleGenerateTimeline}
                      size="lg"
                      className="w-full md:w-auto"
                    >
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Timeline Images
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {generatedImages.month12 && !showGenerateButton && (
              <TimelineSlider
                beforeImage={generatedImages.month0}
                generatedImages={generatedImages}
                totalGrafts={graftEstimate.total}
                norwoodStage={analysis.norwoodStage}
                onRegenerate={handleRegenerate}
                isGenerating={isGenerating}
                generatingMonth={generatingMonth}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
