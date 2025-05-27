import { AssessmentType } from '@/types/enums/session/assessment-type';
import { RecordType } from '@/types/enums/session/record-type';
import { Status } from '@/types/enums/session/status';
import { Lecturer } from './lecturer';

export interface Session {
  name: string;
  mark?: number;
  assessmentType: AssessmentType;
  recordType: RecordType;
  date?: string;
  status: Status;
  lecturer: Lecturer;
}
