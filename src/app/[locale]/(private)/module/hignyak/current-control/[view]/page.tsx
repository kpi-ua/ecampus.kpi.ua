import { notFound } from 'next/navigation';
import { type SearchParams } from 'nuqs/server';

import { currentControlViews } from '../../routes';
import { CurrentControlView } from '../components/current-control-view';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ view: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { view } = await params;
  const selectedView = currentControlViews.find((value) => value === view);
  if (!selectedView) {
    notFound();
  }

  return <CurrentControlView view={selectedView} searchParams={await searchParams} />;
}
