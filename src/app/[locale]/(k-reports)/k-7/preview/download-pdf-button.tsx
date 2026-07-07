'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { parseContentDispositionFilename } from '@/lib/utils';

interface DownloadPdfButtonProps {
  downloadUrl: string;
  fileName: string;
}

export function DownloadPdfButton({ downloadUrl, fileName }: DownloadPdfButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(downloadUrl);

      if (!response.ok) {
        throw new Error('Unable to download PDF');
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      const resolvedFileName = contentDisposition
        ? (parseContentDispositionFilename(contentDisposition) ?? fileName)
        : fileName;
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = objectUrl;
      link.download = resolvedFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch {
      setError('Не вдалося завантажити PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <Button
        className="h-[36px] rounded-[8px] px-5 py-0 text-[12px] leading-[16px]"
        loading={loading}
        onClick={handleDownload}
        size="small"
      >
        Завантажити PDF
      </Button>
      {error && <span className="leading-xs text-status-danger-300 text-xs font-semibold">{error}</span>}
    </div>
  );
}
