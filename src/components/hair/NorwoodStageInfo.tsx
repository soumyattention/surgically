import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HairAnalysisResult } from "@/lib/hair-types";
import { Info, DollarSign, Activity } from "lucide-react";

interface NorwoodStageInfoProps {
  analysis: HairAnalysisResult;
}

export const NorwoodStageInfo = ({ analysis }: NorwoodStageInfoProps) => {
  const estimatedCost = analysis.estimatedGraftsNeeded * 3.5; // $3.50 per graft average

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-2xl font-bold mb-2">Analysis Results</h3>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-lg px-4 py-1">
                Norwood Stage {analysis.norwoodStage}
              </Badge>
              <Badge variant="outline">{analysis.severity}</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Grafts Needed</h4>
            </div>
            <p className="text-2xl font-bold">{analysis.estimatedGraftsNeeded.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">follicular units</p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Estimated Cost</h4>
            </div>
            <p className="text-2xl font-bold">
              ${Math.round(estimatedCost * 0.8).toLocaleString()} - ${Math.round(estimatedCost * 1.2).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">USD</p>
          </div>

          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-5 h-5 text-primary" />
              <h4 className="font-semibold">Candidate Quality</h4>
            </div>
            <p className="text-2xl font-bold capitalize">{analysis.candidateQuality}</p>
            <p className="text-sm text-muted-foreground">for transplant</p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Key Findings
          </h4>
          <ul className="space-y-1 text-sm">
            <li>• Hairline thinning: {analysis.hairlineThinning ? "Yes" : "No"}</li>
            <li>• Crown thinning: {analysis.crownThinning ? "Yes" : "No"}</li>
            <li>
              • Expected timeline: 12-18 months for full results
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
