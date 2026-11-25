import { getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { createLoader, parseAsStringLiteral, type SearchParams } from 'nuqs/server';
import { dash } from 'radash';

import { redirect } from '@/i18n/routing';

import { AttestationView } from '../../components/attestation-view';
import { attestationPeriods, attestationReports, DNVR_PATH, getAttestationPath } from '../../routes';

const loadPeriod = createLoader({ period: parseAsStringLiteral(attestationPeriods) });

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ segments: string[] }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ segments }, query] = await Promise.all([params, searchParams]);
  const [first, second] = segments;
  const legacyPeriod = attestationPeriods.find((value) => value === first);
  const reportSlug = legacyPeriod ? second : first;
  const report = attestationReports.find((value) => dash(value) === reportSlug);

  if (segments.length > (legacyPeriod ? 2 : 1) || (reportSlug && !report)) {
    notFound();
  }

  if (legacyPeriod || query.period === 'all') {
    return redirect({
      href: {
        pathname: query.period === 'all' ? DNVR_PATH : getAttestationPath(report),
        query: { ...query, period: query.period === 'all' ? 'all' : legacyPeriod },
      },
      locale: await getLocale(),
    });
  }

  if (!report) {
    notFound();
  }

  return <AttestationView period={loadPeriod(query).period ?? '1'} report={report} searchParams={query} />;
}
