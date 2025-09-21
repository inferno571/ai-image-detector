import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageSelect: (files: FileList | File[]) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onImageSelect(e.target.files);
      e.target.value = ''; // Reset for re-uploading
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageSelect(e.dataTransfer.files);
    }
  }, [onImageSelect]);

  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    // To prevent flickering, only update state if it's changing
    if (isDragging !== dragging) {
      setIsDragging(dragging);
    }
  };

  return (
    <motion.label
      onDrop={handleDrop}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      className="relative flex justify-center items-center w-full h-40 px-4 transition-colors duration-300 bg-black/20 border-2 border-dashed border-glass-border rounded-xl cursor-pointer focus:outline-none overflow-hidden"
      whileHover={{ scale: 1.02, borderColor: 'rgba(0, 245, 212, 0.5)' }}
      transition={{ duration: 0.2 }}
    >
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 bg-brand-accent/10 border-2 border-brand-accent shadow-glow z-10 rounded-xl"
          />
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center space-y-2 z-20 pointer-events-none">
        <UploadIcon className={`w-8 h-8 transition-transform duration-300 ${isDragging ? 'scale-110 text-brand-accent' : 'text-brand-subtle'}`} />
        <span className="font-medium text-brand-subtle text-center">
          Drop your images here, or <span className="text-brand-accent font-semibold">browse files</span>
        </span>
      </div>
      <input type="file" name="file_upload" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} multiple />
    </motion.label>
  );
};
