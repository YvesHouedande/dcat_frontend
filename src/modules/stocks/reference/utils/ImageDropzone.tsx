import { Upload } from "lucide-react";
import { useState } from "react";

// Composant de glisser-déposer pour l'image
export const ImageDropzone = ({
  onImageSelected,
}: {
  onImageSelected: (img: string) => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
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
      setPreviewUrl(result);
      onImageSelected(result);
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
      {previewUrl ? (
        <div className="relative w-full h-48">
          <img
            src={previewUrl}
            alt="Prévisualisation"
            className="w-full h-full object-contain"
          />
          <button
            type="button"
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
            onClick={() => {
              setPreviewUrl(null);
              onImageSelected("");
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <>
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Glissez et déposez une image ici, ou
          </p>
          <label className="mt-2 inline-block cursor-pointer text-blue-600 hover:text-blue-800">
            <span>Parcourir vos fichiers</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileInput}
            />
          </label>
        </>
      )}
    </div>
  );
};