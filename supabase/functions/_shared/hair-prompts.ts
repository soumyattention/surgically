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
    totalGrafts * (month === 3 ? 0.175 : month === 6 ? 0.5 : 0.775)
  );
  
  if (month === 3) {
    return `HAIR TRANSPLANT PROGRESS - MONTH 3 (Early Growth)

REFERENCE IMAGES PROVIDED: BEFORE and AFTER (Month 12)

GROWTH STATUS: 15-20% of ${totalGrafts} grafts growing (~${activeGrafts} active)

SPECIFICATIONS:
- Hair Length: 1-2cm (very short baby hairs)
- Diameter: Fine, thinner than mature hair
- Density: 15-20% from BEFORE to AFTER
- Coverage: Sparse, patchy, lots of visible scalp
- Hairline: Beginning to define but very faint
- Growth: Uneven (some areas ahead - this is normal)

PATIENT REALITY:
- Still looks thin and unimpressive
- Too short to style
- Most wouldn't notice transplant yet
- This is the "ugly duckling" phase

CRITICAL: Show only 15-20% progress. Hair too short to lay flat. Maintain exact facial features from BEFORE image.`;
  }
  
  if (month === 6) {
    return `HAIR TRANSPLANT PROGRESS - MONTH 6 (Mid-Point)

REFERENCE IMAGES: BEFORE and AFTER provided

GROWTH STATUS: 50% of ${totalGrafts} grafts growing (~${activeGrafts} active)

SPECIFICATIONS:
- Hair Length: 4-6cm (can be lightly styled)
- Density: EXACTLY HALFWAY between BEFORE and AFTER (50%)
- Hairline: Well-defined and clearly visible
- Coverage: Substantial but obviously incomplete
- Color: Mature pigmentation achieved

MILESTONE:
- Transformation visible to others
- Can style hair (less volume than final)
- Looks approximately 50% of the way to final result

CRITICAL: Show 50% interpolation between BEFORE and AFTER images. Maintain exact facial features.`;
  }
  
  return `HAIR TRANSPLANT PROGRESS - MONTH 9 (Near-Complete)

REFERENCE IMAGES: BEFORE and AFTER provided

GROWTH STATUS: 75-80% of ${totalGrafts} grafts growing (~${activeGrafts} active)

SPECIFICATIONS:
- Hair Length: 7-9cm (fully styleable)
- Density: 75-80% coverage (nearly complete)
- Hairline: Complete and natural
- Coverage: Near-complete across all areas
- Appearance: Looks excellent to most observers

STATUS:
- Very satisfied appearance
- Most think transplant is "done"
- Only subtle areas still maturing

CRITICAL: 75-80% similarity to AFTER. Very close but subtle differences remain. Maintain exact facial features.`;
};
