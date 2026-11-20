import { type SearchParams } from 'nuqs/server';

import { Paragraph } from '@/components/typography';

import { loadDekanatFilters } from '../load-filters';
import { AttestationReport } from './components/attestation-report';

export default async function ReportsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { options, t, faculty, facultyFilter, yearId, semester, periodTypeId } = await loadDekanatFilters(searchParams);

  if (!faculty) {
    return <Paragraph>{t('noFaculty')}</Paragraph>;
  }

  return (
    <AttestationReport
      t={t}
      facultyFilter={facultyFilter}
      facultyId={faculty.id}
      years={options.years}
      periodTypes={options.periodTypes}
      yearId={yearId}
      semester={semester}
      periodTypeId={periodTypeId}
    />
  );
}
