import { Lecturer } from '@/types/models/current-control/lecturer';

export interface ExternalMaterials {
  date: string;
  name: string;
  lecturer: Lecturer;
  url: string;
}

export interface InternalMaterials {
  date: string;
  name: string;
  lecturer: Lecturer;
  resourceId: string;
}
