import { HairDensity } from "./hair-types";

export function calculateHairDensity(
  norwoodStage: string,
  monthsPostOp: number
): HairDensity {
  // Base graft calculations by Norwood stage
  const graftsNeeded: Record<string, number> = {
    "1": 0,
    "2": 1500,
    "2A": 1800,
    "3": 2000,
    "3A": 2300,
    "3V": 2500,
    "4": 3000,
    "4A": 3500,
    "5": 3500,
    "5A": 4000,
    "6": 4500,
    "7": 5500,
  };

  const totalGrafts = graftsNeeded[norwoodStage] || 2500;

  // Growth timeline (percentage of final result)
  const growthCurve: Record<number, number> = {
    0: 0, // Day of surgery
    1: 0, // Month 1: shock loss, looks worse
    2: 5, // Month 2: minimal growth
    3: 15, // Month 3: early baby hairs
    4: 25, // Month 4: more visible
    5: 35, // Month 5: noticeable
    6: 50, // Month 6: half coverage
    7: 60, // Month 7
    8: 70, // Month 8
    9: 80, // Month 9
    10: 85, // Month 10
    11: 90, // Month 11
    12: 95, // Month 12: final result
    13: 96,
    14: 97,
    15: 98, // Month 15: slight refinement
    16: 99,
    17: 99,
    18: 100, // Month 18: complete
  };

  const densityPercent = growthCurve[monthsPostOp] || 0;
  const activeGrafts = Math.round((totalGrafts * densityPercent) / 100);

  return {
    month: monthsPostOp,
    densityPercent,
    activeGrafts,
    totalGrafts,
    stage: getStageDescription(monthsPostOp),
  };
}

export function getStageDescription(month: number): string {
  if (month === 0) return "Immediately post-surgery";
  if (month === 1) return "Healing phase (shock loss)";
  if (month <= 3) return "Early growth phase";
  if (month <= 6) return "Active growth phase";
  if (month <= 9) return "Maturation phase";
  if (month <= 12) return "Near-final results";
  return "Complete transformation";
}

export function getTimelineMonths(): number[] {
  return [0, 1, 3, 6, 9, 12, 15, 18];
}

export function generateHairTransplantPrompt(
  norwoodStage: string,
  month: number,
  totalGrafts: number
): string {
  const density = calculateHairDensity(norwoodStage, month);

  const basePrompt = `
Simulate a hair transplant result for a patient initially at Norwood Stage ${norwoodStage}.
This image represents ${month} months post-surgery.

CRITICAL REQUIREMENTS:
`;

  const monthSpecificInstructions: Record<number, string> = {
    0: `
- Show fresh transplant: tiny circular grafts visible in grid pattern
- Redness and swelling on scalp
- Hair still present but freshly implanted
- Small scabs at each graft site
- ${totalGrafts} visible graft points
- Medical setting appearance
`,
    1: `
- Healing phase: most transplanted hair has fallen out (shock loss)
- Scalp looks similar to pre-surgery but with healing
- Some scabbing resolved, slight redness remains
- Very minimal new hair growth (almost none)
- DO NOT show significant hair yet - this is normal and expected
- Patient may look temporarily more bald than before
`,
    3: `
- Early growth: ${density.densityPercent}% hair density
- Baby hairs emerging: very fine, thin, short (1-2cm)
- Hairline slightly more defined but still sparse
- Mix of bald areas and fine new growth
- Natural, uneven growth pattern (not uniform)
- Hair looks "fuzzy" and immature
`,
    6: `
- Mid-growth: ${density.densityPercent}% hair density
- ${density.activeGrafts} grafts actively producing hair
- Noticeable improvement: thicker, longer hairs (3-5cm)
- Hairline clearly defined, crown filling in
- Still visibly less dense than final result
- Natural variation in hair thickness
- Can start to style hair
`,
    9: `
- Advanced growth: ${density.densityPercent}% hair density
- Significant transformation visible
- Hair longer (5-8cm), much thicker
- Coverage looks nearly complete from front
- Some thin spots remaining (normal at this stage)
- Natural hairline fully formed
`,
    12: `
- Final result: ${density.densityPercent}% hair density
- Full, dense, natural-looking hairline
- ${density.activeGrafts} grafts producing mature hair
- Hair length 8-10cm+, can be styled normally
- Completely restored, youthful appearance
- Tiny, well-healed scars at donor area (back of head)
- Result looks indistinguishable from natural hair
- Professional, polished appearance
`,
    15: `
- Refinement phase: ${density.densityPercent}% hair density
- Slight additional thickening and maturation
- Hair fully integrated with natural hair
- Maximum density achieved
- Any remaining thin areas filled in
`,
    18: `
- Complete transformation: ${density.densityPercent}% hair density
- Absolute final result with maximum density
- Hair fully mature and thick
- Perfect natural appearance
- Long-term stable result
`,
  };

  const instruction =
    monthSpecificInstructions[month] || monthSpecificInstructions[12];

  return (
    basePrompt +
    instruction +
    `

MAINTAIN:
- Original face, skin tone, facial features
- Natural hair color and texture
- Realistic skin texture and pores
- Same lighting and background
- Only modify hair density and coverage

IMPORTANT:
- Photorealistic medical simulation
- Natural, uneven growth (hair doesn't grow uniformly)
- Clinically accurate for ${month}-month post-op results
- Show realistic progression, not idealized results
- Hair should look age-appropriate and natural

OUTPUT: A highly realistic medical simulation image showing the expected appearance at month ${month} post-transplant.
`
  );
}
