import { Lecturer } from '@/types/models/lecturer';

interface Attestation {
  result: boolean;
  semester: number;
  number: number;
}
export interface AttestationResult {
  id?: number;
  name: string;
  attestations: Attestation[];
  lecturer: Lecturer;
}
