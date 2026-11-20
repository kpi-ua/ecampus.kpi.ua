import { type SearchParams } from 'nuqs/server';

import { Paragraph } from '@/components/typography';

import { loadDeansOfficeFilters } from '../../load-filters';
import { Disciplines } from '../components/disciplines';

export default async function MissingAttestationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { params, options, t, faculty, facultyFilter, departmentId, yearId, semester, periodTypeId } =
    await loadDeansOfficeFilters(searchParams);

  if (!faculty) {
    return <Paragraph>{t('noFaculty')}</Paragraph>;
  }

  return (
    <Disciplines
      t={t}
      facultyFilter={facultyFilter}
      facultyId={faculty.id}
      options={options}
      departmentId={departmentId}
      yearId={yearId}
      programId={params.programId}
      semester={semester}
      periodTypeId={periodTypeId}
      missing
    />
  );
}
