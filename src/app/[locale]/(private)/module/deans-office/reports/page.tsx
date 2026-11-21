import { getTranslations } from 'next-intl/server';
import { type SearchParams } from 'nuqs/server';

import { getDeansOfficeOptions } from '@/actions/deans-office.actions';
import { Paragraph } from '@/components/typography';

import { loadDeansOfficeSearchParams } from '../search-params';
import { INTL_NAMESPACE } from '../translations';
import { AttestationReport } from './components/attestation-report';

export default async function ReportsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await loadDeansOfficeSearchParams(searchParams);
  const [options, t] = await Promise.all([getDeansOfficeOptions(null), getTranslations(INTL_NAMESPACE)]);
  const semester = params.semester === 2 ? 2 : 1;
  const periodTypeId =
    options.periodTypes.find((item) => item.id === params.periodTypeId)?.id ?? options.periodTypes[0]?.id ?? null;

  if (!options.faculties.length) {
    return <Paragraph>{t('noFaculty')}</Paragraph>;
  }

  return <AttestationReport t={t} periodTypes={options.periodTypes} semester={semester} periodTypeId={periodTypeId} />;
}
