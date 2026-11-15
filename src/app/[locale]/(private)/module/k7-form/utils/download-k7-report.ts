import saveAs from 'file-saver';

import { getK7FormPdf } from '@/actions/k7-form.actions';

interface DownloadK7ReportParams {
  requestId: string;
  year: number;
}

export const downloadK7Report = async ({ requestId, year }: DownloadK7ReportParams) => {
  const blob = await getK7FormPdf(requestId);

  saveAs(blob, `k7-report-${year}-${requestId}.pdf`);
};
