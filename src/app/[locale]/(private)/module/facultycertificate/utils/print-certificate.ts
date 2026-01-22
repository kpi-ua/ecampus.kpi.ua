import { getCertificatePDF, getUnsignedCertificatePDF } from '@/actions/certificates.actions';
import { base64ToBlob } from '@/lib/utils';
import saveAs from 'file-saver';

function printPdfBlob(blob: Blob, _filename?: string): Promise<void> {
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    // Open PDF in a new window for more reliable printing across browsers (especially Edge)
    const printWindow = window.open(url, '_blank');

    if (!printWindow) {
      // Fallback to iframe if popup is blocked
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.src = url;

      const cleanup = () => {
        URL.revokeObjectURL(url);
        iframe.remove();
      };

      iframe.onload = () => {
        try {
          setTimeout(() => {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            resolve();
            setTimeout(cleanup, 60000); // Keep iframe longer for Edge
          }, 500); // Wait for PDF to fully render
        } catch (err) {
          cleanup();
          reject(err);
        }
      };

      iframe.onerror = () => {
        cleanup();
        reject(new Error('Failed to load the PDF into the iframe.'));
      };

      document.body.appendChild(iframe);
      return;
    }

    // New window opened successfully - resolve immediately
    // The user can print from the new tab
    resolve();

    // Clean up URL after a delay (user may need time to print)
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
  });
}

export async function printCertificate(id: number) {
  const { base64, filename } = await getCertificatePDF(id);
  const blob = base64ToBlob(base64, 'application/pdf');
  await printPdfBlob(blob, filename);
}

export async function printUnsignedCertificate(id: number) {
  const { base64, filename } = await getUnsignedCertificatePDF(id);
  const blob = base64ToBlob(base64, 'application/pdf');
  await printPdfBlob(blob, filename);
}

export async function downloadCertificate(id: number) {
  const { base64, filename } = await getCertificatePDF(id);
  const blob = base64ToBlob(base64, 'application/pdf');
  saveAs(blob, filename);
}

export async function downloadUnsignedCertificate(id: number) {
  const { base64, filename } = await getUnsignedCertificatePDF(id);
  const blob = base64ToBlob(base64, 'application/pdf');
  saveAs(blob, filename);
}
