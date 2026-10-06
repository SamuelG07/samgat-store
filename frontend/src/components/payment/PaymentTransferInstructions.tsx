import { useState } from 'react';
import toast from 'react-hot-toast';
import { BANK_DETAILS } from '../../config/bankDetails';

interface PaymentTransferInstructionsProps {
  orderId: number;
  total: number;
  formatKz: (v: number) => string;
}

export default function PaymentTransferInstructions({
  orderId,
  total,
  formatKz,
}: PaymentTransferInstructionsProps) {
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

  const whatsappMessage = encodeURIComponent(
    `Olá! Fiz a transferência do pedido #${orderId} no valor de ${formatKz(total)}. Segue o comprovativo em anexo.`
  );

  const emailSubject = encodeURIComponent(`Comprovativo de pagamento — Pedido #${orderId}`);
  const emailBody = encodeURIComponent(
    `Olá,\n\nFiz a transferência do pedido #${orderId} no valor de ${formatKz(total)}.\n\nSegue o comprovativo em anexo.\n\nObrigado.`
  );

  return (
    <div className="space-y-6">
      {/* Passo 1: dados bancários */}
      <div className="bg-samgat-off-white border border-samgat-gray-lighter rounded-lg p-5">
        <h3 className="text-sm font-semibold text-samgat-black mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-samgat-black text-white text-xs flex items-center justify-center">
            1
          </span>
          Faz a transferência
        </h3>

        <p className="text-sm text-samgat-gray-light mb-4">
          Transfere o valor exato para uma destas contas:
        </p>

        <div className="space-y-3">
          {/* Titular */}
          <div className="flex items-center justify-between gap-3 bg-white border border-samgat-gray-lighter rounded-lg px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs text-samgat-gray-light uppercase">Titular</p>
              <p className="text-sm font-medium text-samgat-black truncate">
                {BANK_DETAILS.holder}
              </p>
            </div>
          </div>

          {/* IBAN */}
          <div className="flex items-center justify-between gap-3 bg-white border border-samgat-gray-lighter rounded-lg px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-samgat-gray-light uppercase">
                IBAN — {BANK_DETAILS.bank}
              </p>
              <p className="text-sm font-mono font-medium text-samgat-black truncate">
                {BANK_DETAILS.iban}
              </p>
            </div>
            <button
              onClick={() => handleCopy(BANK_DETAILS.iban, 'iban')}
              className="flex-shrink-0 text-xs font-medium text-samgat-black hover:underline"
            >
              {copiedField === 'iban' ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>

          {/* KWiK */}
          <div className="flex items-center justify-between gap-3 bg-white border border-samgat-gray-lighter rounded-lg px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-samgat-gray-light uppercase">
                KWiK (transferência instantânea)
              </p>
              <p className="text-sm font-mono font-medium text-samgat-black">
                {BANK_DETAILS.kwik}
              </p>
            </div>
            <button
              onClick={() => handleCopy(BANK_DETAILS.kwik.replace(/\s/g, ''), 'kwik')}
              className="flex-shrink-0 text-xs font-medium text-samgat-black hover:underline"
            >
              {copiedField === 'kwik' ? '✓ Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Valor a transferir */}
        <div className="mt-4 pt-4 border-t border-samgat-gray-lighter flex items-center justify-between">
          <span className="text-sm text-samgat-gray-light">Valor a transferir:</span>
          <span className="text-lg font-bold text-samgat-black">{formatKz(total)}</span>
        </div>

        {/* Aviso importante */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs text-yellow-800">
            <strong>⚠️ Importante:</strong> usa o <strong>ID #{orderId}</strong> como
            referência da transferência (se o banco permitir).
          </p>
        </div>
      </div>

      {/* Passo 2: enviar comprovativo */}
      <div className="bg-samgat-off-white border border-samgat-gray-lighter rounded-lg p-5">
        <h3 className="text-sm font-semibold text-samgat-black mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-samgat-black text-white text-xs flex items-center justify-center">
            2
          </span>
          Envia o comprovativo
        </h3>

        <p className="text-sm text-samgat-gray-light mb-4">
          Depois de transferir, envia o comprovativo por WhatsApp ou Email com o
          teu <strong className="text-samgat-black">ID #{orderId}</strong>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* WhatsApp */}
          <a
            href={`https://wa.me/${BANK_DETAILS.whatsapp.replace(/\s|\+/g, '')}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-samgat-black text-white px-4 py-3 rounded-lg hover:bg-samgat-dark transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Enviar por WhatsApp
          </a>

          {/* Email */}
          <a
            href={`mailto:${BANK_DETAILS.email}?subject=${emailSubject}&body=${emailBody}`}
            className="flex items-center justify-center gap-2 bg-white border border-samgat-gray-lighter text-samgat-black px-4 py-3 rounded-lg hover:bg-samgat-off-white transition-colors text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Enviar por Email
          </a>
        </div>

        <p className="text-xs text-samgat-gray-light mt-4 text-center">
          O teu pedido será confirmado assim que recebermos e verificarmos o
          comprovativo.
        </p>
      </div>

      {/* Passo 3: aviso */}
      <div className="p-4 bg-samgat-black text-white rounded-lg">
        <p className="text-sm">
          <strong>Depois de enviares o comprovativo</strong>, clica em "Já enviei o
          comprovativo" abaixo para registarmos a tua intenção de pagamento.
        </p>
      </div>
    </div>
  );
}
