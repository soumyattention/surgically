import { useState, useRef, useEffect } from 'react';
import { formatBytes, useFileUpload, type FileMetadata, type FileWithPreview } from '@/hooks/use-file-upload';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ImageIcon, TriangleAlert, Upload, XIcon, ZoomInIcon, Camera } from 'lucide-react';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
interface GalleryUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  onPhotoSelected?: (file: File) => void;
}
export default function GalleryUpload({
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024,
  // 10MB
  accept = 'image/jpeg,image/png',
  multiple = false,
  className,
  onFilesChange,
  onPhotoSelected
}: GalleryUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // No default images for the photo upload use case
  const defaultImages: FileMetadata[] = [];
  const [{
    files,
    isDragging,
    errors
  }, {
    removeFile,
    clearFiles,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    openFileDialog,
    getInputProps
  }] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles: defaultImages,
    onFilesChange
  });

  // Call onPhotoSelected when a file is added (for single file mode)
  useEffect(() => {
    if (!multiple && files.length > 0 && onPhotoSelected) {
      const latestFile = files[files.length - 1].file;
      if (latestFile instanceof File) {
        onPhotoSelected(latestFile);
      }
    }
  }, [files, multiple, onPhotoSelected]);
  const isImage = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    return type.startsWith('image/');
  };
  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onPhotoSelected) {
      onPhotoSelected(file);
    }
  };
  return <div className={cn('w-full max-w-4xl', className)}>
      {/* Upload Area */}
      <div className={cn('relative rounded-lg border border-dashed p-8 text-center transition-colors', isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50')} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
        <input {...getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-4">
          <div className={cn('flex h-16 w-16 items-center justify-center rounded-full', isDragging ? 'bg-primary/10' : 'bg-muted')}>
            <ImageIcon className={cn('h-5 w-5', isDragging ? 'text-primary' : 'text-muted-foreground')} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upload Patient Photos</h3>
            <p className="text-sm text-muted-foreground">
              {multiple ? `Upload ${maxFiles} patient photos from different angles` : 'Drag and drop or click to select a patient photo'}
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG (max {formatBytes(maxSize)} per file)
            </p>
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            <Button onClick={openFileDialog} className="text-white bg-[#c278c9]">
              <Upload className="h-4 w-4" />
              Choose File
            </Button>

            <Button variant="secondary" onClick={() => cameraInputRef.current?.click()} className="bg-[c278c9] bg-[#d7a1dd]/[0.26]">
              <Camera className="h-4 w-4" />
              Take Photo
            </Button>
          </div>

          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleCameraCapture} />
        </div>
      </div>

      {/* Gallery Stats */}
      {files.length > 0 && <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h4 className="text-sm font-medium">
              Gallery ({files.length}/{maxFiles})
            </h4>
            <div className="text-xs text-muted-foreground">
              Total: {formatBytes(files.reduce((acc, file) => acc + file.file.size, 0))}
            </div>
          </div>
          <Button onClick={clearFiles} variant="outline" size="sm">
            Clear all
          </Button>
        </div>}

      {/* Image Grid */}
      {files.length > 0 && <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {files.map(fileItem => <div key={fileItem.id} className="group relative aspect-square">
              {isImage(fileItem.file) && fileItem.preview ? <img src={fileItem.preview} alt={fileItem.file.name} className="h-full w-full rounded-lg border object-cover transition-transform group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center rounded-lg border bg-muted">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>}

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {/* View Button */}
                {fileItem.preview && <Button onClick={() => setSelectedImage(fileItem.preview!)} variant="secondary" size="icon" className="size-7">
                    <ZoomInIcon className="opacity-100/80" />
                  </Button>}

                {/* Remove Button */}
                <Button onClick={() => removeFile(fileItem.id)} variant="secondary" size="icon" className="size-7">
                  <XIcon className="opacity-100/80" />
                </Button>
              </div>

              {/* File Info */}
              <div className="absolute bottom-0 left-0 right-0 rounded-b-lg bg-black/70 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-xs font-medium">{fileItem.file.name}</p>
                <p className="text-xs text-gray-300">{formatBytes(fileItem.file.size)}</p>
              </div>
            </div>)}
        </div>}

      {/* Error Messages */}
      {errors.length > 0 && <Alert variant="destructive" appearance="light" className="mt-5">
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>File upload error(s)</AlertTitle>
            <AlertDescription>
              {errors.map((error, index) => <p key={index} className="last:mb-0">
                  {error}
                </p>)}
            </AlertDescription>
          </AlertContent>
        </Alert>}

      {/* Image Preview Modal */}
      {selectedImage && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-h-full max-w-full">
            <img src={selectedImage} alt="Preview" className="max-h-full max-w-full rounded-lg object-contain" onClick={e => e.stopPropagation()} />
            <Button onClick={() => setSelectedImage(null)} variant="secondary" size="icon" className="absolute end-2 top-2 size-7 p-0">
              <XIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>}
    </div>;
}