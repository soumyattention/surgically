import { HairDensity, HairCharacteristics, GraftEstimate } from "./hair-types";

// Norwood graft data
const NORWOOD_GRAFT_DATA = {
  "I": { avg: 0 },
  "II": { avg: 1000 },
  "IIa": { avg: 1200 },
  "III": { avg: 1900 },
  "IIIa": { avg: 2100 },
  "III Vertex": { avg: 2500 },
  "IV": { avg: 3300 },
  "IVa": { avg: 3700 },
  "V": { avg: 4400 },
  "Va": { avg: 4900 },
  "VI": { avg: 5500 },
  "VII": { avg: 6500 }
} as const;

const ADJUSTMENT_FACTORS = {
  hairThickness: { fine: 1.15, medium: 1.0, coarse: 0.90 },
  contrast: { low: 0.90, medium: 1.0, high: 1.10 },
  texture: { straight: 1.0, wavy: 0.95, curly: 0.90 }
};

const GROWTH_TIMELINE = [
  { month: 0, percentage: 0, description: "Immediate post-op", hairLength: "1-2mm", phase: "Surgical day" },
  { month: 3, percentage: 15, description: "Early growth phase", hairLength: "1-2cm", phase: "Early anagen" },
  { month: 6, percentage: 50, description: "Mid-point growth", hairLength: "4-6cm", phase: "Active growth" },
  { month: 9, percentage: 80, description: "Advanced growth", hairLength: "7-9cm", phase: "Maturation" },
  { month: 12, percentage: 95, description: "Final result", hairLength: "10-12cm", phase: "Complete" }
];

export const calculateHairDensity = (norwoodStage: string, month: number): HairDensity => {
  const stageKey = norwoodStage as keyof typeof NORWOOD_GRAFT_DATA;
  const baseGrafts = NORWOOD_GRAFT_DATA[stageKey]?.avg || 2500;
  const timelineEntry = GROWTH_TIMELINE.find(t => t.month === month) || GROWTH_TIMELINE[4];
  
  return {
    month,
    densityPercent: timelineEntry.percentage,
    activeGrafts: Math.round(baseGrafts * (timelineEntry.percentage / 100)),
    totalGrafts: baseGrafts,
    stage: timelineEntry.description,
    hairLength: timelineEntry.hairLength,
    phase: timelineEntry.phase
  };
};

export const calculateGrafts = (norwoodStage: string, hairCharacteristics: HairCharacteristics): GraftEstimate => {
  const stageKey = norwoodStage as keyof typeof NORWOOD_GRAFT_DATA;
  const baseGrafts = NORWOOD_GRAFT_DATA[stageKey]?.avg || 2500;
  
  const thicknessMultiplier = ADJUSTMENT_FACTORS.hairThickness[hairCharacteristics.thickness];
  const contrastMultiplier = ADJUSTMENT_FACTORS.contrast[hairCharacteristics.contrast];
  const textureMultiplier = ADJUSTMENT_FACTORS.texture[hairCharacteristics.texture];
  
  const totalMultiplier = thicknessMultiplier * contrastMultiplier * textureMultiplier;
  const adjustedGrafts = Math.round((baseGrafts * totalMultiplier) / 100) * 100;
  
  return {
    total: adjustedGrafts,
    breakdown: {
      hairline: Math.round(adjustedGrafts * 0.35),
      midScalp: Math.round(adjustedGrafts * 0.25),
      crown: Math.round(adjustedGrafts * 0.25),
      temples: Math.round(adjustedGrafts * 0.15),
    }
  };
};

export const getTimelineMonths = (): number[] => [0, 3, 6, 9, 12];
