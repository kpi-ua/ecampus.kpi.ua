import { getLocale } from 'next-intl/server';
import { createLoader, parseAsStringLiteral, type SearchParams } from 'nuqs/server';

import { redirect } from '@/i18n/routing';

import { currentControlViews, getCurrentControlPath } from '../routes';
import { CurrentControlView } from './components/current-control-view';

const loadLegacyView = createLoader({ view: parseAsStringLiteral(currentControlViews) });

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { view, ...query } = await searchParams;
  const legacy = loadLegacyView({ view });
  if (legacy.view) {
    return redirect({ href: { pathname: getCurrentControlPath(legacy.view), query }, locale: await getLocale() });
  }

  return <CurrentControlView view="groups" searchParams={query} />;
}
