
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
      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer bg-white/50 animate-fade-in"
      onDragOver={preventDefault}
      onDragEnter={preventDefault}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-upload")?.click()}
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
          <ImageIcon className="h-6 w-6 text-purple-600" />
        </div>
        <p className="text-lg font-medium mb-2">Upload your artwork</p>
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop or click to browse
        </p>
        <div className="flex items-center gap-1 text-sm text-purple-600">
          <UploadIcon className="h-4 w-4" />
          <span>Select Image</span>
        </div>
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
