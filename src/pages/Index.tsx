import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GalleryUpload from "@/components/GalleryUpload";
import { LoadingState } from "@/components/LoadingState";
import { PatientInfoForm } from "@/components/PatientInfoForm";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Procedure } from "@/lib/constants";
import { supabase } from "@/integrations/supabase/client";
import { HeroSection } from "@/components/ui/hero-section-dark";
import { HowItWorks } from "@/components/HowItWorks";
import { Pencil } from "lucide-react";
type Step = "info" | "upload" | "results";
const Index = () => {
  const [step, setStep] = useState<Step>("info");
  const [patientName, setPatientName] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [beforeImageUrl, setBeforeImageUrl] = useState<string>("");
  const [afterImageUrl, setAfterImageUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [magicImages, setMagicImages] = useState<{closeup: string; sideProfile: string; happyExpression: string} | null>(null);
  const [isGeneratingMagic, setIsGeneratingMagic] = useState(false);
  const {
    toast
  } = useToast();
  const handlePatientInfoSubmit = (patientInfo: {
    name: string;
    procedure: Procedure;
  }) => {
    setPatientName(patientInfo.name);
    setSelectedProcedure(patientInfo.procedure);
    setStep("upload");
    setIsEditingInfo(false);
  };
  const handleFilesChange = (filesWithPreview: any[]) => {
    const files = filesWithPreview.map(f => f.file).filter(f => f instanceof File);
    setSelectedFiles(files);
    // Set the first image as the before image for display
    if (files.length > 0) {
      setBeforeImageUrl(URL.createObjectURL(files[0]));
    }
  };
  const handleGenerate = async () => {
    if (selectedFiles.length === 0 || !selectedProcedure) return;
    setIsGenerating(true);
    try {
      // Convert all files to base64
      const imageDataArray = await Promise.all(
        selectedFiles.map(file => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );

      console.log(`Sending ${imageDataArray.length} images for simulation`);

      // Call the edge function with multiple images
      const {
        data,
        error
      } = await supabase.functions.invoke("generate-simulation", {
        body: {
          imageDataArray,
          prompt: selectedProcedure.prompt
        }
      });
      if (error) {
        console.error("Error generating simulation:", error);
        if (error.message?.includes("429")) {
          toast({
            title: "Rate limit exceeded",
            description: "Please wait a moment before trying again.",
            variant: "destructive"
          });
        } else if (error.message?.includes("402")) {
          toast({
            title: "Credits required",
            description: "Please add credits to continue using AI features.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Generation failed",
            description: "Unable to generate simulation. Please try again.",
            variant: "destructive"
          });
        }
        return;
      }
      if (data?.imageUrl) {
        setAfterImageUrl(data.imageUrl);
        setStep("results");
        toast({
          title: "Success!",
          description: "Your surgical simulation is ready."
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  const handleTryAnother = () => {
    setSelectedFiles([]);
    setBeforeImageUrl("");
    setAfterImageUrl("");
    setStep("upload");
  };
  const handleUploadNew = () => {
    setSelectedFiles([]);
    setSelectedProcedure(null);
    setPatientName("");
    setBeforeImageUrl("");
    setAfterImageUrl("");
    setMagicImages(null);
    setStep("info");
  };

  const getCloseupPrompt = (procedure: Procedure) => {
    const closeupPrompts: Record<string, string> = {
      "rhinoplasty": "Create a detailed closeup shot focusing on the nose and surrounding area. Show the refined nose structure clearly with good lighting.",
      "lip-filler": "Create a detailed closeup shot focusing on the lips and mouth area. Show the enhanced lip volume and definition clearly.",
      "botox": "Create a detailed closeup shot focusing on the forehead, between eyebrows, and eye area. Show the smoothed wrinkles and relaxed expression clearly.",
      "hair-transplant": "Create a detailed closeup shot focusing on the hairline and frontal scalp area. Show the dense, full hair coverage and strong hairline clearly.",
      "brow-lift": "Create a detailed closeup shot focusing on the eyebrows and forehead area. Show the elevated brow position and smoothed forehead clearly.",
      "face-contouring": "Create a detailed closeup shot focusing on the jawline and lower face. Show the defined V-line contour and sculpted appearance clearly.",
      "chin-surgery": "Create a detailed closeup shot focusing on the chin and lower facial profile. Show the enhanced chin projection and balanced profile clearly.",
      "mole-removal": "Create a detailed closeup shot focusing on the area where the mole was removed. Show the clear, smooth skin with minimal scarring clearly.",
      "cleft-lip-repair": "Create a detailed closeup shot focusing on the upper lip and nose base area. Show the repaired lip with natural symmetry clearly.",
      "chemical-peel": "Create a detailed closeup shot focusing on the facial skin texture. Show the improved skin tone, reduced fine lines, and smoother complexion clearly."
    };
    return closeupPrompts[procedure.id] || "Create a detailed closeup shot of the surgical area showing the results clearly.";
  };

  const handleUseMagic = async () => {
    if (!afterImageUrl || !selectedProcedure) return;
    
    setIsGeneratingMagic(true);
    try {
      const closeupPrompt = getCloseupPrompt(selectedProcedure);
      const sideProfilePrompt = "Transform this image to show a clear side profile view (90-degree angle) of the person's face, maintaining all the surgical results and features.";
      const happyExpressionPrompt = "Keep the exact same image and surgical results, but change the facial expression to a natural, genuine happy smile.";

      console.log("Starting Magic generation with prompts:", {
        closeup: closeupPrompt,
        sideProfile: sideProfilePrompt,
        happy: happyExpressionPrompt
      });

      // Call edge function 3 times in parallel
      const [closeupResult, sideProfileResult, happyResult] = await Promise.all([
        supabase.functions.invoke("generate-simulation", {
          body: {
            imageDataArray: [afterImageUrl],
            prompt: closeupPrompt
          }
        }),
        supabase.functions.invoke("generate-simulation", {
          body: {
            imageDataArray: [afterImageUrl],
            prompt: sideProfilePrompt
          }
        }),
        supabase.functions.invoke("generate-simulation", {
          body: {
            imageDataArray: [afterImageUrl],
            prompt: happyExpressionPrompt
          }
        })
      ]);

      console.log("Magic API Results:", {
        closeup: { error: closeupResult.error, hasData: !!closeupResult.data?.imageUrl },
        sideProfile: { error: sideProfileResult.error, hasData: !!sideProfileResult.data?.imageUrl },
        happy: { error: happyResult.error, hasData: !!happyResult.data?.imageUrl }
      });

      // Check for errors and log them specifically
      if (closeupResult.error) {
        console.error("Closeup generation error:", closeupResult.error);
        throw new Error(`Closeup failed: ${closeupResult.error.message}`);
      }
      if (sideProfileResult.error) {
        console.error("Side profile generation error:", sideProfileResult.error);
        throw new Error(`Side profile failed: ${sideProfileResult.error.message}`);
      }
      if (happyResult.error) {
        console.error("Happy expression generation error:", happyResult.error);
        throw new Error(`Happy expression failed: ${happyResult.error.message}`);
      }

      // Validate data
      if (!closeupResult.data?.imageUrl || !sideProfileResult.data?.imageUrl || !happyResult.data?.imageUrl) {
        console.error("Missing image URLs in response:", {
          closeup: closeupResult.data,
          sideProfile: sideProfileResult.data,
          happy: happyResult.data
        });
        throw new Error("One or more images were not generated properly");
      }

      setMagicImages({
        closeup: closeupResult.data.imageUrl,
        sideProfile: sideProfileResult.data.imageUrl,
        happyExpression: happyResult.data.imageUrl
      });

      toast({
        title: "Magic complete!",
        description: "3 additional views have been generated."
      });
    } catch (error) {
      console.error("Error generating magic images:", error);
      toast({
        title: "Magic failed",
        description: "Unable to generate additional views. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingMagic(false);
    }
  };
  return <div className="min-h-screen">
      <HeroSection title="The last thing patients see before saying yes." subtitle={{
      regular: "The future of ",
      gradient: "surgical consultation",
      after: " is here."
    }} description="Show patients their surgical results before they leave your office. Made for plastic surgeons, dermatologists, and aesthetic clinics." ctaButtons={[{
      text: "Try Surgically Now",
      href: "#dashboard",
      primary: true
    }, {
      text: "View Showcase",
      href: "#showcase"
    }]} />
      
      <HowItWorks />
      
      <div id="dashboard" className="bg-background py-12 px-4">
        <div className="container mx-auto">
        {/* Header */}
        <motion.header initial={{
          opacity: 0,
          y: -20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5
        }} className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Surgically AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered surgical simulation for plastic surgeons and clinics.
            Show patients realistic before/after results instantly.
          </p>
        </motion.header>

        {/* Main Content */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {step === "info" && <motion.div key="info" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0
            }} transition={{
              duration: 0.5
            }}>
                <PatientInfoForm onProceed={handlePatientInfoSubmit} />
              </motion.div>}

            {step === "upload" && !isEditingInfo && <motion.div key="upload" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0
            }} transition={{
              duration: 0.5
            }} className="space-y-8">
                <div className="glass-card rounded-3xl p-6 max-w-2xl mx-auto space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Patient</p>
                        <p className="font-semibold">{patientName}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditingInfo(true)}
                        className="h-8 w-8 rounded-full"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Procedure</p>
                      <p className="font-semibold">{selectedProcedure?.icon} {selectedProcedure?.name}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full max-w-2xl mx-auto">
                  <GalleryUpload onFilesChange={handleFilesChange} maxFiles={4} multiple={true} />
                </div>

                {selectedFiles.length > 0 && beforeImageUrl && <motion.div initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} className="flex justify-center gap-4">
                      <Button size="lg" variant="secondary" onClick={() => setStep("info")} className="rounded-full px-8 bg-slate-900 hover:bg-slate-800 text-slate-50">
                        Back
                      </Button>
                      <Button size="lg" className="rounded-full px-8" onClick={handleGenerate}>
                        Generate Simulation
                      </Button>
                  </motion.div>}
              </motion.div>}

            {step === "upload" && isEditingInfo && <motion.div key="edit-info" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} exit={{
              opacity: 0
            }} transition={{
              duration: 0.5
            }}>
                <PatientInfoForm 
                  onProceed={handlePatientInfoSubmit}
                  initialName={patientName}
                  initialProcedure={selectedProcedure}
                />
                <div className="flex justify-center mt-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => setIsEditingInfo(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>}

            {step === "results" && <BeforeAfterSlider 
              beforeImage={beforeImageUrl} 
              afterImage={afterImageUrl} 
              onTryAnother={handleTryAnother} 
              onUploadNew={handleUploadNew}
              onUseMagic={handleUseMagic}
              isGeneratingMagic={isGeneratingMagic}
              magicImages={magicImages}
            />}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.5
        }} className="text-center mt-16 text-sm text-muted-foreground">
          <p>
            Surgically uses advanced AI to provide surgical simulations for
            educational purposes.
          </p>
          <p className="mt-1">
            Results are approximations and should not replace professional
            medical consultation.
          </p>
        </motion.footer>
        </div>
      </div>

      <AnimatePresence>{isGenerating && <LoadingState />}</AnimatePresence>
    </div>;
};
export default Index;