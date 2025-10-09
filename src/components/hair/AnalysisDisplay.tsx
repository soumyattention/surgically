import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HairAnalysisResult, GraftEstimate } from "@/lib/hair-types";
import { Info } from "lucide-react";

interface AnalysisDisplayProps {
  analysis: HairAnalysisResult;
  graftEstimate: GraftEstimate;
}

export const AnalysisDisplay = ({ analysis, graftEstimate }: AnalysisDisplayProps) => {
  const costEstimate = {
    min: Math.round(graftEstimate.total * 2.5),
    max: Math.round(graftEstimate.total * 5)
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold">Analysis Results</h2>
            <Badge variant="outline" className="text-lg">
              {analysis.confidence}% Confidence
            </Badge>
          </div>
          <p className="text-muted-foreground">{analysis.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Norwood Stage</p>
            <p className="text-3xl font-bold text-primary">{analysis.norwoodStage}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Grafts Needed</p>
            <p className="text-3xl font-bold">{graftEstimate.total.toLocaleString()}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Estimated Cost</p>
            <p className="text-xl font-bold">
              ${costEstimate.min.toLocaleString()} - ${costEstimate.max.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <h3 className="font-semibold mb-3">Hair Characteristics</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Thickness:</span>
                <span className="capitalize">{analysis.hairCharacteristics.thickness}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Texture:</span>
                <span className="capitalize">{analysis.hairCharacteristics.texture}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Color:</span>
                <span className="capitalize">{analysis.hairCharacteristics.color}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contrast:</span>
                <span className="capitalize">{analysis.hairCharacteristics.contrast}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Graft Distribution</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hairline:</span>
                <span>{graftEstimate.breakdown.hairline.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mid-Scalp:</span>
                <span>{graftEstimate.breakdown.midScalp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Crown:</span>
                <span>{graftEstimate.breakdown.crown.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temples:</span>
                <span>{graftEstimate.breakdown.temples.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2 p-4 bg-primary/5 rounded-lg">
          <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            This analysis uses the clinically-validated Norwood-Hamilton Scale and ISHRS graft estimation standards. 
            Actual graft requirements should be confirmed by an in-person consultation.
          </p>
        </div>
      </div>
    </Card>
  );
};
