import { notFound } from 'next/navigation';

import { getK7FormPreview } from '@/actions/k7-form.actions';

import { K7PreviewContent } from './page.content';

interface Props {
  searchParams: Promise<{ requestId?: string }>;
}

export default async function K7PreviewPage({ searchParams }: Props) {
  const { requestId } = await searchParams;

  if (!requestId) notFound();

  const preview = await getK7FormPreview(requestId);

  return <K7PreviewContent preview={preview} />;
}
