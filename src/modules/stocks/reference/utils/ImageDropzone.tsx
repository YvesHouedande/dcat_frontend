import { Upload } from "lucide-react";
import { useState } from "react";

// Composant de glisser-déposer pour l'image
export const ImageDropzone = ({
  onImageSelected,
}: {
  onImageSelected: (img: string, file: File) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Gérer plusieurs fichiers si déposés en même temps
      Array.from(e.dataTransfer.files).forEach(file => {
        if (file.type.match("image.*")) {
          handleFile(file);
        }
      });
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Gérer plusieurs fichiers sélectionnés
      Array.from(e.target.files).forEach(file => {
        handleFile(file);
      });
      // Reset l'input pour permettre de sélectionner les mêmes fichiers à nouveau
      e.target.value = '';
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Veuillez sélectionner une image");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onImageSelected(result, file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Glissez et déposez une ou plusieurs images ici, ou
      </p>
      <label className="mt-2 inline-block cursor-pointer text-blue-600 hover:text-blue-800">
        <span>Parcourir vos fichiers</span>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={handleFileInput}
        />
      </label>
      <p className="mt-1 text-xs text-gray-500">
        Formats supportés: PNG, JPG, JPEG, GIF, WebP
      </p>
    </div>
  );
};