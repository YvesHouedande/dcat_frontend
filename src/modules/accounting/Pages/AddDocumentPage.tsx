// accounting/Pages/AddDocumentPage.tsx
import React, { useState, useRef, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { Fichier } from '../data/type';

const AddDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Fichier, 'id' | 'url' | 'thumbnail'>>({
    titre: '',
    type: 'comptabilité',
    date: new Date()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Utilisation de useCallback pour optimiser les handlers
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: name === 'date' ? new Date(value) : value
      }));
    },
    []
  );

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const file = fileInputRef.current?.files?.[0];
        if (!file) throw new Error('Aucun fichier sélectionné');

        const newDocument: Fichier = {
          ...formData,
          id: `temp-${Date.now()}`,
          url: URL.createObjectURL(file),
          thumbnail: previewUrl || '/default-thumbnail.jpg'
        };

        console.log('Document à enregistrer:', newDocument);
        setTimeout(() => navigate('/accounting'), 1500);
      } catch (error) {
        console.error("Erreur lors de l'ajout:", error);
        setIsSubmitting(false);
      }
    },
    [formData, navigate, previewUrl]
  );

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Ajouter un document</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne gauche - Formulaire */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titre du document *
                </label>
                <input
                  type="text"
                  name="titre"
                  value={formData.titre}
                  onChange={handleInputChange} // Utilisé ici
                  required
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type de document *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange} // Utilisé ici
                  required
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="comptabilité">Comptabilité</option>
                  <option value="finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date du document *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date.toISOString().split('T')[0]}
                  onChange={handleInputChange} // Utilisé ici
                  required
                  className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fichier * (PDF, JPG, PNG)
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange} // Utilisé ici
                  accept=".pdf,.jpg,.jpeg,.png"
                  required
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                />
              </div>
            </div>

            {/* Colonne droite - Prévisualisation */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h2 className="text-lg font-medium mb-4">Aperçu</h2>
              {previewUrl ? (
                <DocumentPreview formData={formData} previewUrl={previewUrl} />
              ) : (
                <EmptyPreview />
              )}
            </div>
          </div>

          <FormActions 
            isSubmitting={isSubmitting} 
            onCancel={() => navigate('/accounting')}
          />
        </form>
      </div>
    </Layout>
  );
};

// Sous-composants pour une meilleure lisibilité
const DocumentPreview: React.FC<{
  formData: Omit<Fichier, 'id' | 'url' | 'thumbnail'>;
  previewUrl: string;
}> = ({ formData, previewUrl }) => (
  <div className="flex flex-col items-center">
    {formData.type === 'comptabilité' ? (
      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mb-3">
        Comptabilité
      </div>
    ) : (
      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mb-3">
        Finance
      </div>
    )}
    
    <div className="w-full h-48 bg-white border flex items-center justify-center mb-3">
      {previewUrl.includes('data:image/') ? (
        <img 
          src={previewUrl} 
          alt="Preview" 
          className="max-h-full max-w-full object-contain"
        />
      ) : (
        <div className="text-center p-4">
          <div className="text-5xl mb-2">📄</div>
          <p className="text-sm text-gray-500">Aperçu PDF non disponible</p>
        </div>
      )}
    </div>
    
    <h3 className="font-medium text-center">
      {formData.titre || "Aucun titre"}
    </h3>
    <p className="text-sm text-gray-500 text-center">
      {formData.date.toLocaleDateString('fr-FR')}
    </p>
  </div>
);

const EmptyPreview: React.FC = () => (
  <div className="text-center py-8 text-gray-400">
    <p>Aucun fichier sélectionné</p>
  </div>
);

const FormActions: React.FC<{
  isSubmitting: boolean;
  onCancel: () => void;
}> = ({ isSubmitting, onCancel }) => (
  <div className="flex justify-end space-x-3 pt-4">
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50"
    >
      Annuler
    </button>
    <button
      type="submit"
      disabled={isSubmitting}
      className={`px-4 py-2 rounded-md text-white ${isSubmitting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
    >
      {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
    </button>
  </div>
);

export default AddDocumentPage;