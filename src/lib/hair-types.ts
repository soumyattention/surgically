export interface HairAnalysisResult {
  norwoodStage: string;
  severity: "mild" | "moderate" | "severe";
  hairlineThinning: boolean;
  crownThinning: boolean;
  estimatedGraftsNeeded: number;
  candidateQuality: "excellent" | "good" | "fair" | "poor";
}

export interface HairDensity {
  month: number;
  densityPercent: number;
  activeGrafts: number;
  totalGrafts: number;
  stage: string;
}
