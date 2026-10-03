'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getUnsignedCertificatePDF } from '@/actions/certificates.actions';
import { base64ToBlob } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface Props {
  certificateId: number;
  disabled?: boolean;
  triggerButton: React.ReactNode;
}

export function PreviewDialog({ certificateId, disabled, triggerButton }: Props) {
  const t = useTranslations('private.facultycertificate.operator');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    if (open && !pdfUrl) {
      setIsLoading(true);
      setError(null);

      try {
        const { base64 } = await getUnsignedCertificatePDF(certificateId);
        const blob = base64ToBlob(base64, 'application/pdf');
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        setError(t('previewError'));
        console.error('Failed to load PDF preview:', err);
      } finally {
        setIsLoading(false);
      }
    }

    // Cleanup URL when dialog closes
    if (!open && pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={disabled}>
        {triggerButton}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t('preview')}</DialogTitle>
        </DialogHeader>
        <div className="h-[70vh] w-full">
          {isLoading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-neutral-500">{t('loadingPreview')}</p>
            </div>
          )}
          {error && (
            <div className="flex h-full items-center justify-center">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          {pdfUrl && !isLoading && !error && (
            <iframe src={pdfUrl} className="h-full w-full rounded border" title="Certificate Preview" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
