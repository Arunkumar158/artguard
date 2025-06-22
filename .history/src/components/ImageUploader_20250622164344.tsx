import React, { useCallback } from "react";
import { ImageIcon, UploadIcon } from "lucide-react";

interface ImageUploaderProps {
  onFileChange: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileChange }) => {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/")) {
          onFileChange(file);
        }
      }
    },
    [onFileChange]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        onFileChange(e.target.files[0]);
      }
    },
    [onFileChange]
  );

  const preventDefault = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
      onDragOver={preventDefault}
      onDragEnter={preventDefault}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-foreground mb-1">
          Drop your artwork here or click to browse
        </p>
        <p className="text-sm text-muted-foreground">
          Supports PNG, JPG, GIF up to 10MB
        </p>
      </div>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
      />
    </div>
  );
};
