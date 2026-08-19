import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getK7FormPreview } from '@/actions/k7-form.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

import { K7PreviewLoading } from './components/k7-preview-loading';
import { K7PreviewContent } from './page.content';

const INTL_NAMESPACE = 'private.k-reports.k-7';

interface Props {
  searchParams: Promise<{ requestId?: string; pending?: string; all?: string }>;
}

export default async function K7PreviewPage({ searchParams }: Props) {
  const [t, { requestId, pending, all }] = await Promise.all([getTranslations(INTL_NAMESPACE), searchParams]);

  if (!requestId) notFound();

  const content =
    pending === 'true' ? (
      <K7PreviewLoading requestId={requestId} all={all === 'true'} />
    ) : (
      <K7PreviewContent preview={await getK7FormPreview(requestId)} />
    );

  return (
    <SubLayout pageTitle={t('preview.title')} breadcrumbs={[['/k-7', t('title')]]}>
      <div className="col-span-12 w-full min-w-0">{content}</div>
    </SubLayout>
  );
}
