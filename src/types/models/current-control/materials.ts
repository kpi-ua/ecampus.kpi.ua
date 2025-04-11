import { Teacher } from '@/types/models/current-control/teacher';

export interface ExternalMaterials {
  date: string;
  name: string;
  lecturer: Teacher;
  url: string;
}

export interface InternalMaterials {
  date: string;
  name: string;
  lecturer: Teacher;
  resourceId: string;
}
