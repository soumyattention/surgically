import { useState, useCallback, ChangeEvent } from 'react';

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface FileWithPreview {
  id: string;
  file: File | FileMetadata;
  preview: string | null;
}

interface UseFileUploadOptions {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void;
}

interface UseFileUploadState {
  files: FileWithPreview[];
  isDragging: boolean;
  errors: string[];
}

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export function useFileUpload({
  maxFiles = 10,
  maxSize = 5 * 1024 * 1024,
  accept = 'image/*',
  multiple = true,
  initialFiles = [],
  onFilesChange,
}: UseFileUploadOptions = {}) {
  const [state, setState] = useState<UseFileUploadState>({
    files: initialFiles.map(file => ({
      id: file.id,
      file: file,
      preview: file.url || null,
    })),
    isDragging: false,
    errors: [],
  });

  const validateFile = useCallback(
    (file: File): string | null => {
      // Check file type
      if (accept) {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const isAccepted = acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            return file.type.startsWith(type.replace('/*', ''));
          }
          return file.type === type;
        });

        if (!isAccepted) {
          return `File type "${file.type}" is not accepted`;
        }
      }

      // Check file size
      if (file.size > maxSize) {
        return `File size (${formatBytes(file.size)}) exceeds maximum (${formatBytes(maxSize)})`;
      }

      return null;
    },
    [accept, maxSize]
  );

  const addFiles = useCallback(
    (newFiles: File[]) => {
      setState(prev => {
        const errors: string[] = [];
        const validFiles: FileWithPreview[] = [];

        // Check if adding new files would exceed maxFiles
        const availableSlots = maxFiles - prev.files.length;
        if (newFiles.length > availableSlots) {
          errors.push(`Can only add ${availableSlots} more file(s). Maximum is ${maxFiles} files.`);
        }

        // Process files
        newFiles.slice(0, availableSlots).forEach(file => {
          const error = validateFile(file);
          if (error) {
            errors.push(`${file.name}: ${error}`);
          } else {
            const preview = file.type.startsWith('image/')
              ? URL.createObjectURL(file)
              : null;

            validFiles.push({
              id: `${Date.now()}-${Math.random()}`,
              file,
              preview,
            });
          }
        });

        const newState = {
          ...prev,
          files: [...prev.files, ...validFiles],
          errors: errors.length > 0 ? errors : [],
        };

        onFilesChange?.(newState.files);
        return newState;
      });
    },
    [maxFiles, validateFile, onFilesChange]
  );

  const removeFile = useCallback(
    (id: string) => {
      setState(prev => {
        const fileToRemove = prev.files.find(f => f.id === id);
        if (fileToRemove?.preview && fileToRemove.file instanceof File) {
          URL.revokeObjectURL(fileToRemove.preview);
        }

        const newFiles = prev.files.filter(f => f.id !== id);
        onFilesChange?.(newFiles);

        return {
          ...prev,
          files: newFiles,
        };
      });
    },
    [onFilesChange]
  );

  const clearFiles = useCallback(() => {
    setState(prev => {
      prev.files.forEach(fileItem => {
        if (fileItem.preview && fileItem.file instanceof File) {
          URL.revokeObjectURL(fileItem.preview);
        }
      });

      onFilesChange?.([]);

      return {
        ...prev,
        files: [],
        errors: [],
      };
    });
  }, [onFilesChange]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState(prev => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setState(prev => ({ ...prev, isDragging: false }));

      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    },
    [addFiles]
  );

  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
      addFiles(selectedFiles);
      e.target.value = '';
    },
    [addFiles]
  );

  const openFileDialog = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.onchange = (e) => handleFileInputChange(e as any);
    input.click();
  }, [accept, multiple, handleFileInputChange]);

  const getInputProps = useCallback(
    () => ({
      type: 'file' as const,
      accept,
      multiple,
      onChange: handleFileInputChange,
    }),
    [accept, multiple, handleFileInputChange]
  );

  return [
    state,
    {
      addFiles,
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] as const;
}
