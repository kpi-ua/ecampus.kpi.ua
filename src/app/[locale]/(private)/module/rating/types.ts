import { RatingEntry } from '@/types/models/rating';

export interface EntriesTableProps {
  entries: RatingEntry[];
}

export interface TreeGroup {
  treeName: string;
  treeId: number;
  entries: RatingEntry[];
}

export interface GroupedByWorkKind {
  workKindName: string;
  workKindId: number;
  treeGroups: TreeGroup[];
  totalResult: number;
}
