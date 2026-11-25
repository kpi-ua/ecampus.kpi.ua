import { getLocale } from 'next-intl/server';
import { createLoader, parseAsStringLiteral, type SearchParams } from 'nuqs/server';

import { redirect } from '@/i18n/routing';

import { AttestationView } from '../components/attestation-view';
import { attestationPeriods, DNVR_PATH } from '../routes';

const loadPeriod = createLoader({ period: parseAsStringLiteral(attestationPeriods) });

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = await searchParams;
  if (query.period === 'all') {
    return redirect({ href: DNVR_PATH, locale: await getLocale() });
  }

  return <AttestationView period={loadPeriod(query).period} searchParams={query} />;
}
