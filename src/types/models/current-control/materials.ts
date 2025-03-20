import { Teacher } from '@/types/models/current-control/teacher';

export interface InternalMaterials {
  date: string;
  material: { name: string; link: string };
  teacher: Teacher;
}
export interface ExternalMaterials extends InternalMaterials {}
