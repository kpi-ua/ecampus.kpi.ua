import { EventsPlan } from '@/types/models/current-control/events-plan';
import { Journal } from '@/types/models/current-control/journal';
import { ExternalMaterials, InternalMaterials } from '@/types/models/current-control/materials';
import { Lecturer } from '@/types/models/lecturer';

export interface CreditModule {
  id: string;
  semester: number;
  studyYear: string;
  name: string;
  lecturers: Lecturer[];
  journal: Journal;
  eventsPlan: EventsPlan[];
  internalMaterials: InternalMaterials[];
  externalMaterials: ExternalMaterials[];
}
