import { notFound } from 'next/navigation';

import { getK7FormPreview } from '@/actions/k7-form.actions';

import { K7PreviewContent } from './page.content';

interface Props {
  searchParams: Promise<{ k7ReportRequestId?: string }>;
}

export default async function K7PreviewPage({ searchParams }: Props) {
  const { k7ReportRequestId } = await searchParams;

  if (!k7ReportRequestId) notFound();

  const preview = await getK7FormPreview(k7ReportRequestId);

  return <K7PreviewContent preview={preview} />;
}
