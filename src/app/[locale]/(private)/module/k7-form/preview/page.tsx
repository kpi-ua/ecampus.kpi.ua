import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getK7FormPreview, getK7FormRequests } from '@/actions/k7-form.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';
import { K7_REPORT_REQUEST_STATUS } from '@/types/models/k7-form';

import { K7PreviewContent } from './page.content';

const INTL_NAMESPACE = 'private.k-7';

interface Props {
  searchParams: Promise<{ requestId?: string; all?: string }>;
}

export default async function K7PreviewPage({ searchParams }: Props) {
  const [t, { requestId, all }] = await Promise.all([getTranslations(INTL_NAMESPACE), searchParams]);

  if (!requestId) notFound();

  // The preview itself only needs the captured data, but the download button must wait for the
  // rendered file, and the details payload carries no status — so the request is looked up in the
  // grid data. A failed lookup keeps the preview readable and merely withholds the button.
  const [preview, requests] = await Promise.all([
    getK7FormPreview(requestId),
    getK7FormRequests({ all: all === 'true' }).catch(() => []),
  ]);
  const request = requests.find((item) => item.k7ReportRequestId === requestId);
  const pdfReady = request?.status === K7_REPORT_REQUEST_STATUS.Ready && Boolean(request.s3StorageKey);

  return (
    <SubLayout pageTitle={t('preview.title')} breadcrumbs={[['/module/k7-form', t('title')]]}>
      <div className="col-span-12 w-full min-w-0">
        <K7PreviewContent preview={preview} pdfReady={pdfReady} />
      </div>
    </SubLayout>
  );
}
