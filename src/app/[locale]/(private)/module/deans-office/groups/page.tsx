import { type SearchParams } from 'nuqs/server';

import { Paragraph } from '@/components/typography';

import { loadDeansOfficeFilters } from '../load-filters';
import { GroupCounts } from './components/group-counts';

export default async function GroupsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { options, t, faculty, facultyFilter, yearId } = await loadDeansOfficeFilters(searchParams);

  if (!faculty) {
    return <Paragraph>{t('noFaculty')}</Paragraph>;
  }

  return (
    <GroupCounts t={t} facultyFilter={facultyFilter} facultyId={faculty.id} yearId={yearId} years={options.years} />
  );
}
