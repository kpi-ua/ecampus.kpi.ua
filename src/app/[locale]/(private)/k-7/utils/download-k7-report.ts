import { getK7FormPdf } from '@/actions/k7-form.actions';

interface DownloadK7ReportParams {
  requestId: string;
  year: number;
}

export const downloadK7Report = async ({ requestId, year }: DownloadK7ReportParams) => {
  const objectUrl = URL.createObjectURL(await getK7FormPdf(requestId));
  const downloadLink = document.createElement('a');

  downloadLink.href = objectUrl;
  downloadLink.download = `k7-report-${year}-${requestId}.pdf`;
  document.body.append(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
};
