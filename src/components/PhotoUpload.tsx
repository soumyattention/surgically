import { motion } from "framer-motion";
import FileInput from "@/components/FileInput";

interface PhotoUploadProps {
  onPhotoSelected: (file: File) => void;
}

export const PhotoUpload = ({ onPhotoSelected }: PhotoUploadProps) => {
  const handleFileChange = async (files: FileList) => {
    if (files && files[0]) {
      onPhotoSelected(files[0]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full flex justify-center"
    >
      <FileInput 
        accept="image/jpeg, image/png"
        maxSizeInMB={10}
        onFileChange={handleFileChange}
        allowMultiple={false}
      />
    </motion.div>
  );
};
