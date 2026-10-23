import { CuratorGroup } from '../types';

interface Filters {
  search: string;
  course?: string;
  speciality?: string;
  groupId?: string;
  onlyUnassigned?: boolean;
}

export const filterAdministrationGroups = (groups: CuratorGroup[], filters: Filters) => {
  const query = filters.search.trim().toLocaleLowerCase('uk');
  return groups.filter(
    (group) =>
      (!query || group.curatorName?.toLocaleLowerCase('uk').includes(query)) &&
      (!filters.course || group.course.toString() === filters.course) &&
      (!filters.speciality || group.speciality === filters.speciality) &&
      (!filters.groupId || group.groupId.toString() === filters.groupId) &&
      (!filters.onlyUnassigned || group.curatorEmployeeId == null),
  );
};
