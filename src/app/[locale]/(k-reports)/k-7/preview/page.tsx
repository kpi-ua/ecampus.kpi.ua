import { notFound } from 'next/navigation';

import { getK7FormPreview } from '@/actions/k7-form.actions';

import { K7PreviewLoading } from './components/k7-preview-loading';
import { K7PreviewContent } from './page.content';

interface Props {
  searchParams: Promise<{ requestId?: string; pending?: string; all?: string }>;
}

export default async function K7PreviewPage({ searchParams }: Props) {
  const { requestId, pending, all } = await searchParams;

  if (!requestId) notFound();

  if (pending === 'true') {
    return <K7PreviewLoading requestId={requestId} all={all === 'true'} />;
  }

  const preview = await getK7FormPreview(requestId);

  return <K7PreviewContent preview={preview} />;
}
