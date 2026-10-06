import { useState } from 'react';
import toast from 'react-hot-toast';
import { BANK_DETAILS } from '../../config/bankDetails';

interface PaymentInstructionsProps {
  method: 'transfer' | 'multicaixa';
  orderId: number;
  total: number;
  formatKz: (v: number) => string;
  reference?: string | null;
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  uploadedUrl?: string | null;
}

export default function PaymentInstructions({
  method,
  orderId,
  total,
  formatKz,
  reference,
  onFileSelect,
  isUploading,
  uploadedUrl,
}: PaymentInstructionsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('Copiado!');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="space-y-6">
      {/* Passo 1 */}
      <div className="bg-samgat-off-white border border-samgat-gray-lighter rounded-lg p-5">
        <h3 className="text-sm font-semibold text-samgat-black mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-samgat-black text-white text-xs flex items-center justify-center">1</span>
          {method === 'transfer' ? 'Faz a transferência' : 'Gera a referência'}
        </h3>

        <div className="space-y-3">
          {method === 'transfer' ? (
            <>
              <div className="bg-white border border-samgat-gray-lighter rounded-lg px-4 py-3">
                <p className="text-xs text-samgat-gray-light uppercase">Titular</p>
                <p className="text-sm font-medium text-samgat-black">{BANK_DETAILS.holder}</p>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white border border-samgat-gray-lighter rounded-lg px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-samgat-gray-light uppercase">IBAN — {BANK_DETAILS.bank}</p>
                  <p className="text-sm font-mono font-medium text-samgat-black truncate">{BANK_DETAILS.iban}</p>
                </div>
                <button
                  onClick={() => handleCopy(BANK_DETAILS.iban, 'iban')}
                  className="flex-shrink-0 text-xs font-medium text-samgat-black hover:underline"
                >
                  {copiedField === 'iban' ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 bg-white border border-samgat-gray-lighter rounded-lg px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-samgat-gray-light uppercase">KWiK</p>
                  <p className="text-sm font-mono font-medium text-samgat-black">{BANK_DETAILS.kwik}</p>
                </div>
                <button
                  onClick={() => handleCopy(BANK_DETAILS.kwik.replace(/\s/g, ''), 'kwik')}
                  className="flex-shrink-0 text-xs font-medium text-samgat-black hover:underline"
                >
                  {copiedField === 'kwik' ? '✓ Copiado' : 'Copiar'}
                </button>
              </div>
            </>
          ) : (
            <div className="bg-white border border-samgat-gray-lighter rounded-lg p-4">
              <p className="text-xs text-samgat-gray-light uppercase mb-1">Referência Multicaixa Express</p>
              <div className="flex items-center justify-between gap-3">
                <span className="text-2xl font-bold font-mono text-samgat-black">
                  {reference || 'A gerar...'}
                </span>
                {reference && (
                  <button
                    onClick={() => handleCopy(reference, 'ref')}
                    className="text-xs font-medium text-samgat-black hover:underline"
                  >
                    {copiedField === 'ref' ? '✓ Copiado' : 'Copiar'}
                  </button>
                )}
              </div>
              <p className="text-xs text-samgat-gray-light mt-3">
                Abre a app <strong>Multicaixa Express</strong> no teu telemóvel e paga o valor abaixo
                usando esta referência.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-samgat-gray-lighter flex items-center justify-between">
          <span className="text-sm text-samgat-gray-light">Valor:</span>
          <span className="text-lg font-bold text-samgat-black">{formatKz(total)}</span>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>⚠️ Importante:</strong> usa o <strong>ID #{orderId}</strong> como referência da transferência.
          </p>
        </div>
      </div>

      {/* Passo 2 */}
      <div className="bg-samgat-off-white border border-samgat-gray-lighter rounded-lg p-5">
        <h3 className="text-sm font-semibold text-samgat-black mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-samgat-black text-white text-xs flex items-center justify-center">2</span>
          Anexa o comprovativo
        </h3>

        {uploadedUrl ? (
          <div className="bg-white border border-samgat-gray-lighter rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-samgat-off-white flex items-center justify-center text-samgat-black flex-shrink-0">
                ✓
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-samgat-black">Comprovativo anexado</p>
                <a
                  href={uploadedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-samgat-gray-light hover:text-samgat-black underline"
                >
                  Ver comprovativo
                </a>
              </div>
            </div>
          </div>
        ) : (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="block cursor-pointer border-2 border-dashed border-samgat-gray-lighter rounded-lg p-8 text-center hover:border-samgat-black transition-colors bg-white"
          >
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />

            {isUploading ? (
              <div>
                <div className="animate-spin rounded-full border-2 border-samgat-gray-lighter border-t-samgat-black w-8 h-8 mx-auto mb-3" />
                <p className="text-sm text-samgat-gray">A enviar...</p>
              </div>
            ) : (
              <>
                <svg className="w-10 h-10 mx-auto mb-3 text-samgat-gray-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium text-samgat-black mb-1">
                  Arrasta o ficheiro ou clica para escolher
                </p>
                <p className="text-xs text-samgat-gray-light">
                  JPG, PNG, WebP ou PDF até 5 MB
                </p>
              </>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
