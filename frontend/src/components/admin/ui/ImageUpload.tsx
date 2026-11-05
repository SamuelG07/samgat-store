import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Imagem do produto' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Apenas imagens são permitidas');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Imagem muito grande (máx 5MB)');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onChange(res.data.data.url);
      toast.success('Imagem carregada');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao carregar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-samgat-black mb-2">{label}</label>
      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-samgat-gray-lighter" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-32 h-32 border-2 border-dashed border-samgat-gray-lighter rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-samgat-black transition-colors bg-samgat-off-white"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-samgat-black" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-samgat-gray-light mb-1" />
              <span className="text-xs text-samgat-gray-light">Carregar</span>
            </>
          )}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        className="hidden"
      />
      <p className="text-xs text-samgat-gray-light mt-1">Arrasta ou clica. JPG, PNG, WebP até 5MB.</p>
    </div>
  );
}
