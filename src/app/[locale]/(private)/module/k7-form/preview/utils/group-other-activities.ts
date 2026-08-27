import { K7OtherEducationalActivity } from '@/types/models/k7-form';

export interface OtherActivityGroup {
  workType: string;
  rows: K7OtherEducationalActivity[];
}

export const groupOtherActivities = (rows: K7OtherEducationalActivity[]): OtherActivityGroup[] =>
  Array.from(
    rows.reduce((groups, row) => {
      const groupRows = groups.get(row.workType);

      if (groupRows) {
        groupRows.push(row);
      } else {
        groups.set(row.workType, [row]);
      }

      return groups;
    }, new Map<string, K7OtherEducationalActivity[]>()),
    ([workType, groupRows]) => ({ workType, rows: groupRows }),
  );
