import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { getK7FormPreview } from '@/actions/k7-form.actions';
import { SubLayout } from '@/app/[locale]/(private)/sub-layout';

import { K7PreviewContent } from './page.content';

const INTL_NAMESPACE = 'private.k-7';

interface Props {
  searchParams: Promise<{ requestId?: string }>;
}

export default async function K7PreviewPage({ searchParams }: Props) {
  const [t, { requestId }] = await Promise.all([getTranslations(INTL_NAMESPACE), searchParams]);

  if (!requestId) notFound();

  return (
    <SubLayout pageTitle={t('preview.title')} breadcrumbs={[['/module/k7-form', t('title')]]}>
      <div className="col-span-12 w-full min-w-0">
        <K7PreviewContent preview={await getK7FormPreview(requestId)} />
      </div>
    </SubLayout>
  );
}
