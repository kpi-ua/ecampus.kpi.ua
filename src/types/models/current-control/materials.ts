import { Lecturer } from '@/types/models/lecturer';

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
