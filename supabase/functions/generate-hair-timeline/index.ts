import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.error("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { image, norwoodStage, month, totalGrafts } = await req.json();

    if (!image || !norwoodStage || month === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const prompt = generatePrompt(norwoodStage, month, totalGrafts);

    console.log(`Generating timeline for Norwood ${norwoodStage}, month ${month}`);

    // Extract base64 data from data URL
    const base64Data = image.split(",")[1];

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Data}`,
                  },
                },
                {
                  type: "text",
                  text: prompt,
                },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      throw new Error("No image generated in response");
    }

    return new Response(
      JSON.stringify({ image: generatedImageUrl }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-hair-timeline function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function generatePrompt(norwoodStage: string, month: number, totalGrafts: number): string {
  const density = calculateDensity(month);
  const activeGrafts = Math.round((totalGrafts * density) / 100);

  const basePrompt = `
Transform this image to show a hair transplant result for a patient initially at Norwood Stage ${norwoodStage}.
This represents ${month} months post-surgery.

CRITICAL REQUIREMENTS:
`;

  const monthInstructions: Record<number, string> = {
    0: `
- Show fresh hair transplant immediately after surgery
- Tiny circular grafts visible in organized grid pattern across hairline
- Redness and swelling on entire scalp area
- Small scabs at each individual graft site
- ${totalGrafts} visible tiny graft dots
- Medical/clinical appearance with fresh surgical work
- Hair looks freshly placed, organized pattern visible
`,
    1: `
- Healing phase: most transplanted hair has fallen out (shock loss - this is NORMAL)
- Scalp appearance similar to before surgery
- Healing nearly complete, minimal redness
- Almost NO new hair growth visible yet (this is medically accurate)
- Patient looks temporarily more bald - THIS IS EXPECTED
- Do NOT show significant hair growth at this stage
`,
    3: `
- Early growth: ${density}% hair density, ${activeGrafts} active grafts
- Baby hairs emerging: extremely fine, thin, very short (1-2cm max)
- Hairline becoming slightly visible but very sparse
- Large bald areas still visible between new hairs
- Natural uneven growth (NOT uniform)
- Hair looks soft and "fuzzy" like baby hair
- Still mostly bald appearance with hints of new growth
`,
    6: `
- Mid-growth: ${density}% hair density, ${activeGrafts} active grafts
- Noticeable improvement: thicker hairs, 3-5cm length
- Hairline clearly defined, crown showing coverage
- Still visibly less dense than final result
- Mix of thick and thin hairs (natural variation)
- Can see scalp between hairs in some areas
- Hair long enough to start styling
`,
    9: `
- Advanced growth: ${density}% hair density, ${activeGrafts} active grafts
- Major transformation visible
- Hair 5-8cm long, significantly thicker
- Coverage nearly complete when viewed from front
- Minor thin spots remaining (normal at this stage)
- Natural mature hairline fully formed
- Most patients very satisfied at this point
`,
    12: `
- Final result: ${density}% hair density, ${activeGrafts} mature grafts
- Full, dense, completely natural-looking hairline
- Hair 8-10cm+ length, can be styled normally
- Complete restoration, youthful appearance
- Well-healed tiny scars at donor area (back of head)
- Indistinguishable from natural hair growth
- Professional polished look
`,
    15: `
- Refinement phase: ${density}% density
- Slight additional thickening
- Maximum density reached
- Hair fully mature and integrated
- Any thin areas completely filled
`,
    18: `
- Complete final result: ${density}% density
- Absolute maximum density achieved
- Hair fully mature and thick
- Perfect natural appearance
- Long-term stable permanent result
`,
  };

  const instruction = monthInstructions[month] || monthInstructions[12];

  return basePrompt + instruction + `

STRICT PRESERVATION RULES:
- Keep exact same face, facial features, skin tone
- Maintain natural hair color and texture
- Preserve realistic skin texture and pores
- Same lighting conditions and background
- ONLY modify hair density and hairline coverage
- Do not change facial structure or features

REALISM REQUIREMENTS:
- Ultra-photorealistic medical simulation
- Natural uneven growth patterns (hair grows at different rates)
- Clinically accurate for ${month}-month post-operative timeline
- Show realistic progression, not idealized perfect results
- Age-appropriate natural appearance
- Medical documentation quality

Generate a highly realistic before-and-after comparison showing the scientifically accurate expected appearance at month ${month} following hair transplant surgery for Norwood Stage ${norwoodStage}.
`;
}

function calculateDensity(month: number): number {
  const growthCurve: Record<number, number> = {
    0: 0,
    1: 0,
    2: 5,
    3: 15,
    4: 25,
    5: 35,
    6: 50,
    7: 60,
    8: 70,
    9: 80,
    10: 85,
    11: 90,
    12: 95,
    13: 96,
    14: 97,
    15: 98,
    16: 99,
    17: 99,
    18: 100,
  };
  return growthCurve[month] || 0;
}
