import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Loader2 } from "lucide-react";
import { GeneratedImages } from "@/lib/hair-types";
import { calculateHairDensity, getTimelineMonths } from "@/lib/hair-calculations";
import { Progress } from "@/components/ui/progress";

interface TimelineSliderProps {
  beforeImage: string;
  generatedImages: GeneratedImages;
  totalGrafts: number;
  norwoodStage: string;
  onRegenerate: (month: 3 | 6 | 9 | 12) => void;
  isGenerating: boolean;
  generatingMonth: number | null;
}

export const TimelineSlider = ({
  beforeImage,
  generatedImages,
  totalGrafts,
  norwoodStage,
  onRegenerate,
  isGenerating,
  generatingMonth
}: TimelineSliderProps) => {
  const [selectedMonth, setSelectedMonth] = useState(12);
  const timelineMonths = getTimelineMonths();
  
  const densityInfo = calculateHairDensity(norwoodStage, selectedMonth);

  const handleMonthChange = (value: number[]) => {
    setSelectedMonth(value[0]);
  };

  const getCurrentImage = () => {
    if (selectedMonth === 0) return beforeImage;
    if (selectedMonth === 3) return generatedImages.month3 || beforeImage;
    if (selectedMonth === 6) return generatedImages.month6 || beforeImage;
    if (selectedMonth === 9) return generatedImages.month9 || beforeImage;
    if (selectedMonth === 12) return generatedImages.month12 || beforeImage;
    return beforeImage;
  };

  const currentImage = getCurrentImage();
  const canRegenerate = selectedMonth === 3 || selectedMonth === 6 || selectedMonth === 9 || selectedMonth === 12;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Growth Timeline Visualization</h3>
        {canRegenerate && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRegenerate(selectedMonth as 3 | 6 | 9 | 12)}
            disabled={isGenerating || generatingMonth === selectedMonth}
          >
            {generatingMonth === selectedMonth ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Regenerate
              </>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="relative w-full bg-muted rounded-xl overflow-hidden flex items-center justify-center">
          {isGenerating && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center space-y-4 p-8">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
                <div>
                  <p className="font-semibold mb-2">Generating {generatingMonth ? `Month ${generatingMonth}` : "Images"}...</p>
                  <p className="text-sm text-muted-foreground">This may take a moment</p>
                </div>
              </div>
            </div>
          )}
          <img
            src={currentImage}
            alt={`Month ${selectedMonth}`}
            className="w-full h-auto object-contain max-h-[600px]"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Month {selectedMonth}</p>
              <p className="text-sm text-muted-foreground">{densityInfo.stage}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{densityInfo.densityPercent}% Density</p>
              <p className="text-sm text-muted-foreground">
                {densityInfo.activeGrafts.toLocaleString()} / {totalGrafts.toLocaleString()} grafts
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Slider
              value={[selectedMonth]}
              onValueChange={handleMonthChange}
              max={12}
              step={3}
              className="w-full"
              disabled={isGenerating}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {timelineMonths.map((month) => (
                <span key={month} className="text-center">
                  Month {month}
                </span>
              ))}
            </div>
          </div>

          <Progress value={densityInfo.densityPercent} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm pt-4 border-t">
          <div className="space-y-1">
            <p className="text-muted-foreground">Hair Length</p>
            <p className="font-medium">{densityInfo.hairLength}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Growth Phase</p>
            <p className="font-medium">{densityInfo.phase}</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Active Grafts</p>
            <p className="font-medium">{densityInfo.activeGrafts.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
