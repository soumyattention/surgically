import { Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PhotoUploadProps {
  type: "front" | "top" | "side";
  required: boolean;
  preview: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
}

export const PhotoUpload = ({ type, required, preview, onUpload, onRemove }: PhotoUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  const labels = {
    front: "Front View",
    top: "Top View",
    side: "Side View"
  };

  const descriptions = {
    front: "Required - Clear front-facing photo",
    top: "Optional - For crown assessment",
    side: "Optional - For profile reference"
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            {labels[type]}
            {required && <span className="text-destructive text-sm">*</span>}
          </h3>
          <p className="text-sm text-muted-foreground">{descriptions[type]}</p>
        </div>

        {!preview ? (
          <label className="cursor-pointer block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 hover:border-primary/40 transition-colors">
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-primary" />
                <p className="text-sm font-medium">Click to upload</p>
                <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
              </div>
            </div>
          </label>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt={`${type} view`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
