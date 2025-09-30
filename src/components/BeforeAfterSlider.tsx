import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  onTryAnother: () => void;
  onUploadNew: () => void;
  onUseMagic: () => void;
  isGeneratingMagic: boolean;
  magicImages: {closeup: string; sideProfile: string; happyExpression: string} | null;
}

export const BeforeAfterSlider = ({
  beforeImage,
  afterImage,
  onTryAnother,
  onUploadNew,
  onUseMagic,
  isGeneratingMagic,
  magicImages,
}: BeforeAfterSliderProps) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(e.touches[0].clientX - rect.left, rect.width)
    );
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold mb-2">Simulation Results</h2>
        <p className="text-muted-foreground">
          Drag the slider to compare before and after
        </p>
      </div>

      <div className="glass-card rounded-3xl p-4 mb-6">
        <div
          className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl cursor-ew-resize select-none"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onTouchMove={handleTouchMove}
        >
          {/* After Image (Full) */}
          <div className="absolute inset-0">
            <img
              src={afterImage}
              alt="After surgery"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
              After
            </div>
          </div>

          {/* Before Image (Clipped) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={beforeImage}
              alt="Before surgery"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-semibold">
              Before
            </div>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-primary cursor-ew-resize"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary shadow-lg flex items-center justify-center">
              <ArrowLeftRight className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* Magic Images Section */}
      {magicImages && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 space-y-4"
        >
          <h3 className="text-xl font-semibold text-center">Magic Views</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card rounded-2xl p-3">
              <img
                src={magicImages.closeup}
                alt="Closeup view"
                className="w-full aspect-square object-cover rounded-xl mb-2"
              />
              <p className="text-center text-sm font-medium">Closeup</p>
            </div>
            <div className="glass-card rounded-2xl p-3">
              <img
                src={magicImages.sideProfile}
                alt="Side profile view"
                className="w-full aspect-square object-cover rounded-xl mb-2"
              />
              <p className="text-center text-sm font-medium">Side Profile</p>
            </div>
            <div className="glass-card rounded-2xl p-3">
              <img
                src={magicImages.happyExpression}
                alt="Happy expression"
                className="w-full aspect-square object-cover rounded-xl mb-2"
              />
              <p className="text-center text-sm font-medium">Happy Expression</p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex gap-4 justify-center flex-wrap mt-6">
        {!magicImages && (
          <Button
            size="lg"
            className="rounded-full px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={onUseMagic}
            disabled={isGeneratingMagic}
          >
            {isGeneratingMagic ? "Generating Magic..." : "✨ Use Magic"}
          </Button>
        )}
        <Button
          size="lg"
          variant="secondary"
          className="rounded-full px-8"
          onClick={onTryAnother}
        >
          Try Another Procedure
        </Button>
        <Button
          size="lg"
          className="rounded-full px-8"
          onClick={onUploadNew}
        >
          Upload New Photo
        </Button>
      </div>
    </motion.div>
  );
};
