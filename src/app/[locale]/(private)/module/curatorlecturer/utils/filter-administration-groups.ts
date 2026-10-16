import { CuratorGroup } from '../types';

interface Filters {
  search: string;
  course?: string;
  educationLevel?: string;
  studyForm?: string;
}

export const filterAdministrationGroups = (groups: CuratorGroup[], filters: Filters) => {
  const query = filters.search.trim().toLocaleLowerCase('uk');
  return groups.filter(
    (group) =>
      (!query || group.curatorName?.toLocaleLowerCase('uk').includes(query)) &&
      (!filters.course || group.course.toString() === filters.course) &&
      (!filters.educationLevel || group.educationLevel === filters.educationLevel) &&
      (!filters.studyForm || group.studyForm === filters.studyForm),
  );
};
