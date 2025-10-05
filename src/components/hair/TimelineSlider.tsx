import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { HairAnalysisResult } from "@/lib/hair-types";
import { calculateHairDensity, getTimelineMonths } from "@/lib/hair-calculations";
import { Sparkles, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface TimelineSliderProps {
  analysis: HairAnalysisResult;
  originalImage: string;
}

export const TimelineSlider = ({
  analysis,
  originalImage,
}: TimelineSliderProps) => {
  const timelineMonths = getTimelineMonths();
  const [currentMonth, setCurrentMonth] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const density = calculateHairDensity(analysis.norwoodStage, currentMonth);

  const handleGenerateTimeline = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-hair-timeline",
        {
          body: {
            image: originalImage,
            norwoodStage: analysis.norwoodStage,
            month: currentMonth,
            totalGrafts: analysis.estimatedGraftsNeeded,
          },
        }
      );

      if (error) throw error;

      setGeneratedImage(data.image);
      toast({
        title: "Timeline Generated",
        description: `Showing results for month ${currentMonth}`,
      });
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: "Unable to generate timeline. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">Interactive Timeline</h3>
          <p className="text-muted-foreground">
            Drag the slider to see your hair transplant journey month-by-month
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="aspect-square bg-secondary/50 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={originalImage}
                alt="Before"
                className="w-full h-full object-cover"
              />
            </div>
            <Badge variant="outline" className="w-full justify-center">
              Before (Norwood {analysis.norwoodStage})
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="aspect-square bg-secondary/50 rounded-lg overflow-hidden flex items-center justify-center">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt={`Month ${currentMonth}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Select a month and generate to see results
                  </p>
                </div>
              )}
            </div>
            <Badge variant="default" className="w-full justify-center">
              Month {currentMonth}
            </Badge>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Timeline Progress</span>
            <span className="text-2xl font-bold text-primary">
              Month {currentMonth}
            </span>
          </div>
          <Slider
            value={[currentMonth]}
            onValueChange={(value) => setCurrentMonth(value[0])}
            max={18}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0 months</span>
            <span>6 months</span>
            <span>12 months</span>
            <span>18 months</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Hair Density</p>
            <p className="text-2xl font-bold">{density.densityPercent}%</p>
            <Progress value={density.densityPercent} className="mt-2" />
          </div>

          <div className="bg-secondary/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Active Grafts</p>
            <p className="text-2xl font-bold">
              {density.activeGrafts.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              of {density.totalGrafts.toLocaleString()}
            </p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4 col-span-2">
            <p className="text-sm text-muted-foreground mb-1">Current Stage</p>
            <p className="font-semibold">{density.stage}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleGenerateTimeline}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Month {currentMonth}
              </>
            )}
          </Button>
          <Button variant="outline" disabled={!generatedImage}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
};
