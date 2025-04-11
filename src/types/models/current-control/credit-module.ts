import { Journal } from '@/types/models/current-control/journal';
import { EventsPlan } from '@/types/models/current-control/events-plan';
import { Teacher } from '@/types/models/current-control/teacher';
import { ExternalMaterials, InternalMaterials } from '@/types/models/current-control/materials';

export interface CreditModule {
  id: string;
  semester: number;
  studyYear: string;
  name: string;
  lecturers: Teacher[];
  journal: Journal[];
  eventsPlan: EventsPlan[];
  internalMaterials: InternalMaterials[];
  externalMaterials: ExternalMaterials[];
}
