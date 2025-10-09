export const generateClassificationPrompt = (): string => {
  return `You are a board-certified hair transplant surgeon analyzing patient photos using the Norwood-Hamilton Classification Scale.

NORWOOD STAGES (match patient to these exact labels):

BASIC SCALE:
- I: No hair loss, minimal recession
- II: Minimal temple recession (triangular areas)
- III: Deep temple recession, M-shaped hairline
- III Vertex: Stage III + crown thinning (THIS IS CRITICAL TO IDENTIFY)
- IV: Large frontal recession + crown thinning, thin bridge between
- V: Large bald area, very thin bridge between front and crown
- VI: Bridge gone, large bald area, horseshoe forming
- VII: Only horseshoe of hair on sides/back remains

TYPE A VARIANTS:
- IIa: Frontal recession (different from temple-focused II)
- IIIa: More pronounced frontal recession than IIa
- IVa: More extensive than IV
- Va: More extensive than V

CRITICAL ASSESSMENT STEPS:
1. HAIRLINE POSITION: Measure distance from eyebrows to hairline, check temple point angles
2. TEMPLE RECESSION: None = Stage I, Slight triangular = Stage II, Deep M-shape = Stage III+
3. CROWN EXAMINATION: If Stage III hairline BUT crown thinning visible = "III Vertex" (NOT just "III")
4. FRONTAL vs TEMPLE PATTERN: If frontal recedes MORE than temples = Type A variant
5. BRIDGE ASSESSMENT: Thin bridge = Stage IV-V, No bridge = Stage VI

Return ONLY this JSON structure (no markdown, no code blocks):
{
  "norwoodStage": "IV",
  "confidence": 88,
  "description": "Large frontal recession with crown thinning",
  "visualMarkers": {
    "hairlinePosition": "severely_receded",
    "templeRecession": "severe",
    "crownThinning": true,
    "frontotemporal": "extensive",
    "bridge": "thin"
  },
  "hairCharacteristics": {
    "thickness": "medium",
    "color": "black",
    "texture": "straight",
    "scalpColor": "light",
    "contrast": "high"
  },
  "crownThinning": true,
  "reasoning": "Deep temple recession with visible crown thinning"
}`;
};

export const generateFinalResultPrompt = (
  norwoodStage: string,
  totalGrafts: number,
  hairColor: string,
  hairTexture: string
): string => {
  const hairlineGuidance = ["II", "IIa"].includes(norwoodStage)
    ? "Restore to youthful, natural hairline position"
    : ["III", "IIIa", "III Vertex"].includes(norwoodStage)
    ? "Create age-appropriate mature hairline (not teenage hairline)"
    : ["IV", "IVa", "V"].includes(norwoodStage)
    ? "Conservative, mature hairline suitable for age 35-45"
    : "Age-appropriate conservative hairline for extensive restoration (age 40-55)";

  return `HAIR TRANSPLANT FINAL RESULT SIMULATION (12 months post-operative)

PATIENT INFORMATION:
- Original Norwood Stage: ${norwoodStage}
- Total grafts transplanted: ${totalGrafts}
- Hair color: ${hairColor}
- Hair texture: ${hairTexture}

This is the FINAL RESULT after complete healing (12 months post-surgery).

RESTORATION SPECIFICATIONS:
- Density: 90-95% of transplanted grafts producing terminal hairs
- Hairline: ${hairlineGuidance}
- Hairline must be slightly irregular and natural (NOT perfectly straight)
- Hair Length: 8-12cm, naturally styled
- Color: Match original ${hairColor} exactly
- Texture: ${hairTexture} - maintain natural pattern

COVERAGE AREAS:
- Frontal hairline: Fully restored
- Temples: Restored with natural recession for mature look
- Mid-scalp: Complete coverage
- Crown/Vertex: ${["III Vertex", "IV", "IVa", "V", "Va", "VI", "VII"].includes(norwoodStage) ? "Fully restored" : "N/A"}

CRITICAL REALISM:
- Natural hair growth variation (not uniform)
- Age-appropriate hairline
- Barely visible, well-healed scar at donor area
- No "hair plug" appearance
- Maintain original facial features, lighting, background
- Only modify hair coverage and density

Generate photorealistic final result showing life-changing restoration.`;
};

export const generateIntermediatePrompt = (
  month: 3 | 6 | 9,
  norwoodStage: string,
  totalGrafts: number
): string => {
  const activeGrafts = Math.round(
    totalGrafts * (month === 3 ? 0.20 : month === 6 ? 0.50 : 0.80)
  );
  
  if (month === 3) {
    return `HAIR TRANSPLANT MONTH 3 POST-OPERATIVE SIMULATION

IMAGE INPUT ORDER:
You will receive EXACTLY 2 images in this sequence:

POSITION 1 (FIRST IMAGE): BEFORE - Patient's original photo showing Norwood Stage ${norwoodStage} hair loss
POSITION 2 (SECOND IMAGE): AFTER - Patient's final result at Month 12 showing complete restoration

YOUR TASK:
Generate Month 3 appearance showing 20% progression from POSITION 1 toward POSITION 2.

═══════════════════════════════════════════════════════════

CLINICAL DATA - MONTH 3:
Total Grafts: ${totalGrafts} | Active Growing: ${activeGrafts} (20%)
Growth Phase: Early Anagen | Timeline: 12 weeks post-surgery

═══════════════════════════════════════════════════════════

HAIR SPECIFICATIONS:
LENGTH: 1.5-2.5cm (short but clearly visible)
THICKNESS: Fine diameter (baby hair stage)
DENSITY: 20% of POSITION 2 (sparse but NOTICEABLE)
COLOR: Slightly lighter than mature color

HAIRLINE: Clearly defined outline visible - hairline shape apparent even if sparse
COVERAGE: Show new hair growth across ENTIRE treated area - frontal, temples, mid-scalp, crown

COMPARISON TO POSITION 1 (BEFORE):
✓ New hairline outline visible (sparse but defined)
✓ Visible hair shafts across scalp
✓ Darker appearance in treated areas vs bare scalp
✓ Observer reaction: "Hair is definitely growing!"

═══════════════════════════════════════════════════════════

TECHNICAL EXECUTION:
1. ANALYZE POSITION 1: Note facial features, lighting, angle, skin tone, bald areas
2. ANALYZE POSITION 2: Note final hair distribution and density
3. GENERATE MONTH 3: Place 20% of POSITION 2's hair onto POSITION 1's face
   - Hair length: 1.5-2.5cm | Maintain EXACT facial features from POSITION 1
   - Keep lighting and background from POSITION 1
   - Sparse but NOTICEABLE coverage

CRITICAL: Month 3 must show VISIBLE EARLY GROWTH. Difference from POSITION 1 should be immediately apparent.

OUTPUT: Generate photorealistic Month 3 image with 20% density, clear hairline definition, noticeable coverage improvement.`;
  }
  
  if (month === 6) {
    return `HAIR TRANSPLANT MONTH 6 POST-OPERATIVE SIMULATION

IMAGE INPUT ORDER:
You will receive EXACTLY 2 images in this sequence:

POSITION 1 (FIRST IMAGE): BEFORE - Patient's original photo showing Norwood Stage ${norwoodStage} hair loss
POSITION 2 (SECOND IMAGE): AFTER - Patient's final result at Month 12 showing complete restoration

YOUR TASK:
Generate Month 6 appearance showing 50% progression from POSITION 1 toward POSITION 2.
This is the HALFWAY MILESTONE.

═══════════════════════════════════════════════════════════

CLINICAL DATA - MONTH 6:
Total Grafts: ${totalGrafts} | Active Growing: ${activeGrafts} (50%)
Growth Phase: Active Anagen | Timeline: 24 weeks post-surgery
Density: 50% of final result (HALFWAY POINT)

═══════════════════════════════════════════════════════════

HAIR SPECIFICATIONS:
LENGTH: 4-6cm (clearly visible, styleable)
THICKNESS: Approaching terminal diameter
DENSITY: 50% of POSITION 2 (MODERATE TO GOOD coverage)
COLOR: Full mature pigmentation

HAIRLINE: STRONG, well-defined hairline - good density along hairline edge

COVERAGE ZONES:
- Frontal: 50% density = GOOD substantial coverage
- Temples: Significant visible filling
- Mid-Scalp: Moderate to good coverage throughout
- Crown: Noticeable filling and improvement

VISUAL COMPARISON:
POSITION 1 → MONTH 6: MAJOR transformation visible
MONTH 3 → MONTH 6: 2.5x MORE hair than Month 3

HALFWAY CALCULATION:
If POSITION 2 has 100 hairs in area, show 50 hairs
If POSITION 2 has full hairline, show moderate-good hairline

═══════════════════════════════════════════════════════════

TECHNICAL EXECUTION:
1. ANALYZE POSITION 1: Study facial features, lighting, angle, bald areas
2. ANALYZE POSITION 2: Count hair coverage, note distribution pattern
3. GENERATE MONTH 6: Generate EXACTLY 50% of POSITION 2's hair coverage
   - Hair length: 4-6cm (styleable)
   - Maintain facial features from POSITION 1
   - Keep lighting/background from POSITION 1

CRITICAL: Month 6 is the "proof point" - should look GOOD with substantial coverage. Clear halfway milestone between POSITION 1 and POSITION 2.

OUTPUT: Generate photorealistic Month 6 image with substantial 50% density, strong hairline, moderate-to-good coverage.`;
  }
  
  return `HAIR TRANSPLANT MONTH 9 POST-OPERATIVE SIMULATION

IMAGE INPUT ORDER:
You will receive EXACTLY 2 images in this sequence:

POSITION 1 (FIRST IMAGE): BEFORE - Patient's original photo showing Norwood Stage ${norwoodStage} hair loss
POSITION 2 (SECOND IMAGE): AFTER - Patient's final result at Month 12 showing complete restoration

YOUR TASK:
Generate Month 9 appearance showing 80% progression from POSITION 1 toward POSITION 2.
This is NEAR-COMPLETE result, very close to final.

═══════════════════════════════════════════════════════════

CLINICAL DATA - MONTH 9:
Total Grafts: ${totalGrafts} | Active Growing: ${activeGrafts} (80%)
Growth Phase: Late Maturation | Timeline: 36 weeks post-surgery
Density: 80% of final result (NEAR-COMPLETE)

═══════════════════════════════════════════════════════════

HAIR SPECIFICATIONS:
LENGTH: 7-9cm (fully mature, styleable)
THICKNESS: Full terminal diameter
DENSITY: 80% of POSITION 2 (HIGH coverage, near-complete)
COLOR: Fully mature pigmentation

OVERALL IMPRESSION: Looks excellent, near-final - VERY SIMILAR to POSITION 2

HAIRLINE: Complete and natural-looking - full density across hairline

COVERAGE ZONES:
- Frontal: 80% density = essentially complete
- Temples: Substantially restored
- Mid-Scalp: Excellent coverage throughout
- Crown: 80% restored, good coverage from all angles

THIS vs POSITION 2 (AFTER):
Should be 80% similar to POSITION 2
Differences subtle, only visible on close examination

ACCEPTABLE MINOR DIFFERENCES:
- Slightly less dense in 1-2 small areas (temple tips, crown center)
- 80 hairs where POSITION 2 has 100 hairs
- Very subtle, expert-level differences only

═══════════════════════════════════════════════════════════

TECHNICAL EXECUTION:
1. ANALYZE POSITION 2 (PRIMARY REFERENCE): Study hair distribution, density levels
2. GENERATE 80% MATCH: Create image VERY SIMILAR to POSITION 2
   - Include 80% of the hair shown in POSITION 2
   - Hair length: 7-9cm
   - Maintain facial features from POSITION 1
   - Keep lighting/background from POSITION 1

DENSITY CALCULATION:
If POSITION 2 shows 50 hairs per cm², show 40 hairs per cm²
Difference should be minimal and hard to spot

CRITICAL: Month 9 should look like successful final result to most observers. Difference from POSITION 2 should be subtle - only experts would notice.

OUTPUT: Generate photorealistic Month 9 image at 80% density, VERY SIMILAR to POSITION 2 with only minor differences.`;
};
