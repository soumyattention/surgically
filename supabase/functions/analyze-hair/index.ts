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

    const { image } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
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

    // Extract base64 data from data URL
    const base64Data = image.split(",")[1];

    const classificationPrompt = `
You are a hair transplant specialist AI. Analyze this image of a person's scalp and hairline.

Classify the hair loss stage using the Norwood-Hamilton Scale:
- Stage 1: No visible hair loss
- Stage 2: Slight temple recession (early M-shape)
- Stage 2A: Slight frontal recession
- Stage 3: Deeper temple recession, defined M-shape
- Stage 3A: Frontal hairline recession
- Stage 3V: Stage 3 plus crown thinning
- Stage 4: Frontal recession + visible crown thinning
- Stage 4A: More extensive frontal and crown loss
- Stage 5: Frontal and crown areas nearly merged
- Stage 5A: Larger area of hair loss
- Stage 6: Large bald area, minimal separation
- Stage 7: Only horseshoe pattern remains

Return ONLY a valid JSON response with this exact structure:
{
  "norwoodStage": "3V",
  "severity": "moderate",
  "hairlineThinning": true,
  "crownThinning": true,
  "estimatedGraftsNeeded": 2500,
  "candidateQuality": "excellent"
}

Rules:
- norwoodStage must be one of: "1", "2", "2A", "3", "3A", "3V", "4", "4A", "5", "5A", "6", "7"
- severity must be: "mild", "moderate", or "severe"
- hairlineThinning and crownThinning must be boolean
- estimatedGraftsNeeded must be a number (range: 0-6000)
- candidateQuality must be: "excellent", "good", "fair", or "poor"

Analyze carefully and provide accurate classification based on visible hairline recession and crown thinning.
`;

    console.log("Calling Lovable AI for hair analysis...");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
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
                  text: classificationPrompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data));

    const analysisText = data.choices?.[0]?.message?.content;
    if (!analysisText) {
      throw new Error("No analysis content in response");
    }

    // Extract JSON from the response (handle markdown code blocks)
    let analysisJson;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisJson = JSON.parse(jsonMatch[0]);
      } else {
        analysisJson = JSON.parse(analysisText);
      }
    } catch (parseError) {
      console.error("Failed to parse analysis JSON:", analysisText);
      throw new Error("Invalid JSON response from AI");
    }

    console.log("Parsed analysis:", analysisJson);

    return new Response(JSON.stringify(analysisJson), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-hair function:", error);
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
