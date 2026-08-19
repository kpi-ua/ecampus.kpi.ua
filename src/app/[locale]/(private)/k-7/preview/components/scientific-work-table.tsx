import { K7DetailedAchievement } from '@/types/models/k7-form';

import { DepartmentWorkTable } from './department-work-table';

interface Props {
  rows: K7DetailedAchievement[];
}

export const ScientificWorkTable = ({ rows }: Props) => <DepartmentWorkTable rows={rows} />;
