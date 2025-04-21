import { Journal } from '@/types/models/current-control/journal';
import { EventsPlan } from '@/types/models/current-control/events-plan';
import { Lecturer } from '@/types/models/current-control/lecturer';
import { ExternalMaterials, InternalMaterials } from '@/types/models/current-control/materials';

export interface CreditModule {
  id: string;
  semester: number;
  studyYear: string;
  name: string;
  lecturers: Lecturer[];
  journal: Journal[];
  eventsPlan: EventsPlan[];
  internalMaterials: InternalMaterials[];
  externalMaterials: ExternalMaterials[];
}
