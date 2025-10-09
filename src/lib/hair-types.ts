export interface HairCharacteristics {
  thickness: "fine" | "medium" | "coarse";
  color: string;
  texture: "straight" | "wavy" | "curly";
  scalpColor: "light" | "medium" | "dark";
  contrast: "low" | "medium" | "high";
}

export interface VisualMarkers {
  hairlinePosition: string;
  templeRecession: string;
  crownThinning: boolean;
  frontotemporal: string;
  bridge: string;
}

export interface HairAnalysisResult {
  norwoodStage: string;
  confidence: number;
  description: string;
  visualMarkers: VisualMarkers;
  hairCharacteristics: HairCharacteristics;
  crownThinning: boolean;
  reasoning: string;
}

export interface GraftBreakdown {
  hairline: number;
  midScalp: number;
  crown: number;
  temples: number;
}

export interface GraftEstimate {
  total: number;
  breakdown: GraftBreakdown;
}

export interface HairDensity {
  month: number;
  densityPercent: number;
  activeGrafts: number;
  totalGrafts: number;
  stage: string;
  hairLength: string;
  phase: string;
}

export interface GeneratedImages {
  month0: string;
  month3: string | null;
  month6: string | null;
  month9: string | null;
  month12: string | null;
}
