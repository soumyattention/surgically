import { useCallback, useState } from "react";
import { Upload, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  onPhotoSelected: (file: File) => void;
}

export const PhotoUpload = ({ onPhotoSelected }: PhotoUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const imageFile = files.find((file) =>
        file.type.startsWith("image/")
      );

      if (imageFile) {
        if (imageFile.size > 10 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please upload an image under 10MB",
            variant: "destructive",
          });
          return;
        }
        onPhotoSelected(imageFile);
      } else {
        toast({
          title: "Invalid file",
          description: "Please upload a JPG or PNG image",
          variant: "destructive",
        });
      }
    },
    [onPhotoSelected, toast]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image under 10MB",
          variant: "destructive",
        });
        return;
      }
      onPhotoSelected(file);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onPhotoSelected(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`glass-card rounded-3xl p-12 transition-smooth ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.02]"
            : "border-border/50"
        }`}
      >
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="p-6 rounded-2xl bg-primary/10 text-primary">
            <Upload className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl tracking-tighter font-geist mx-auto md:text-6xl">Upload Patient Photo</h2>
            <p className="text-muted-foreground">
              Drag and drop or click to select a patient photo
            </p>
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            <Button
              size="lg"
              className="rounded-full px-8"
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose File
            </Button>

            <Button
              size="lg"
              variant="secondary"
              className="rounded-full px-8"
              onClick={() => document.getElementById("camera-capture")?.click()}
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Supported formats: JPG, PNG (max 10MB)
          </p>

          <input
            id="file-upload"
            type="file"
            accept="image/jpeg,image/png"
            className="hidden"
            onChange={handleFileInput}
          />

          <input
            id="camera-capture"
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCameraCapture}
          />
        </div>
      </div>
    </motion.div>
  );
};
