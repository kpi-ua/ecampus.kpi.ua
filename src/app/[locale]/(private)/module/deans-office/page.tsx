import { type SearchParams } from 'nuqs/server';

import { Paragraph } from '@/components/typography';

import { Roster } from './components/roster/roster';
import { loadDeansOfficeFilters } from './load-filters';

export default async function RosterPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { params, options, t, faculty, facultyFilter, departmentId } = await loadDeansOfficeFilters(searchParams);

  if (!faculty) {
    return <Paragraph>{t('noFaculty')}</Paragraph>;
  }

  return (
    <Roster
      t={t}
      facultyFilter={facultyFilter}
      facultyId={faculty.id}
      departments={options.departments}
      departmentId={departmentId}
      course={params.course}
      groupId={params.groupId}
    />
  );
}
