import { K7DetailedAchievement } from '@/types/models/k7-form';

import { DepartmentWorkTable } from './department-work-table';

interface Props {
  rows: K7DetailedAchievement[];
  /** Credited total of section 2 after the 5.3–5.6 limit; the rows stay raw, as in the document. */
  totalHours: number;
}

export const ScientificWorkTable = ({ rows, totalHours }: Props) => (
  <DepartmentWorkTable rows={rows} totalHours={totalHours} />
);
