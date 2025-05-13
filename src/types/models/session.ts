import { Lecturer } from '@/types/models/current-control/lecturer';
import { AssessmentType } from '@/types/enums/session/assessment-type';
import { RecordType } from '@/types/enums/session/record-type';
import { Status } from '@/types/enums/session/status';

export interface Session {
  name: string;
  mark?: number;
  assessmentType: AssessmentType;
  recordType: RecordType;
  date?: string;
  status: Status;
  lecturer: Lecturer;
}
