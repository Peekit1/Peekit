import React from 'react';
import { X, User, Pencil, Camera } from 'lucide-react';
import { Button } from './Button';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isEditing: boolean;
  projectData: {
    clientName: string;
    clientEmail: string;
    date: string;
    location: string;
    type: string;
    expectedDeliveryDate: string;
  };
  onProjectDataChange: (data: any) => void;
  coverFile?: File;
  onCoverFileChange: (file: File | undefined) => void;
}

const DEFAULT_TYPES = ['Mariage', 'Shooting', 'Entreprise', 'Vidéo'];

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  isEditing,
  projectData,
  onProjectDataChange,
  coverFile,
  onCoverFileChange,
}) => {
  const [showCustomType, setShowCustomType] = React.useState(false);
  const [customTypeValue, setCustomTypeValue] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      const isDefaultType = DEFAULT_TYPES.includes(projectData.type);
      if (!isDefaultType && projectData.type) {
        setShowCustomType(true);
        setCustomTypeValue(projectData.type);
      } else {
        setShowCustomType(false);
        setCustomTypeValue('');
      }
    }
  }, [isOpen, projectData.type]);

  const handleTypeChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomType(true);
      onProjectDataChange({ ...projectData, type: customTypeValue || '' });
    } else {
      setShowCustomType(false);
      onProjectDataChange({ ...projectData, type: value });
    }
  };

  const handleCustomTypeChange = (value: string) => {
    setCustomTypeValue(value);
    onProjectDataChange({ ...projectData, type: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-slide-up relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all z-10"
          >
            <X size={20} />
          </button>

          <form onSubmit={onSubmit} className="p-6 md:p-10">
            <div className="w-12 h-12 bg-white text-gray-900 border border-gray-200 rounded-lg flex items-center justify-center mb-6 shadow-sm">
              {isEditing ? <Pencil size={20} strokeWidth={1.5} /> : <User size={20} strokeWidth={1.5} />}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              {isEditing ? 'Modifier le projet' : 'Initialisons votre projet'}
            </h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              {isEditing
                ? 'Mettez à jour les informations du client et les délais.'
                : 'Ajoutez un projet pour voir la magie opérer sur Peekit.'}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Nom du Client
                </label>
                <input
                  autoFocus
                  type="text"
                  required
                  value={projectData.clientName}
                  onChange={(e) => onProjectDataChange({ ...projectData, clientName: e.target.value })}
                  placeholder="Ex: Sophie & Marc"
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Email de contact
                </label>
                <input
                  type="email"
                  required
                  value={projectData.clientEmail}
                  onChange={(e) => onProjectDataChange({ ...projectData, clientEmail: e.target.value })}
                  placeholder="email@client.com"
                  className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={projectData.date}
                    onChange={(e) => onProjectDataChange({ ...projectData, date: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                    Lieu
                  </label>
                  <input
                    type="text"
                    value={projectData.location}
                    onChange={(e) => onProjectDataChange({ ...projectData, location: e.target.value })}
                    placeholder="Ville"
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                    Type
                  </label>
                  <select
                    value={showCustomType ? 'custom' : projectData.type}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none appearance-none cursor-pointer"
                  >
                    {DEFAULT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                    <option value="custom">Personnalisé...</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                    Rendu Estimé
                  </label>
                  <input
                    type="date"
                    value={projectData.expectedDeliveryDate}
                    onChange={(e) => onProjectDataChange({ ...projectData, expectedDeliveryDate: e.target.value })}
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                  />
                </div>
              </div>

              {showCustomType && (
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                    Type personnalisé
                  </label>
                  <input
                    type="text"
                    required
                    value={customTypeValue}
                    onChange={(e) => handleCustomTypeChange(e.target.value)}
                    placeholder="Ex: Portrait, Événement..."
                    className="w-full h-11 px-3 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium focus:bg-white focus:border-black outline-none transition-colors appearance-none"
                  />
                </div>
              )}

              <div className="pt-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">
                  Image de couverture
                </label>
                <div className="relative group/cover">
                  <input
                    type="file"
                    id="cover-upload"
                    className="hidden"
                    onChange={(e) => onCoverFileChange(e.target.files ? e.target.files[0] : undefined)}
                    accept="image/*"
                  />
                  <label
                    htmlFor="cover-upload"
                    className="flex items-center gap-3 w-full h-11 px-3 bg-gray-50 border border-gray-200 border-dashed rounded-md cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all"
                  >
                    <Camera size={18} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 truncate">
                      {coverFile ? coverFile.name : 'Choisir une image...'}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <Button type="button" variant="secondary" onClick={onClose} fullWidth className="h-11">
                Annuler
              </Button>
              <Button
                type="submit"
                variant="black"
                fullWidth
                isLoading={isLoading}
                className="h-11 shadow-lg shadow-black/10"
              >
                {isEditing ? 'Enregistrer' : 'Créer le projet'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
