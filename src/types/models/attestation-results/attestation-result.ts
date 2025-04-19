import { Lecturer } from '@/types/models/lecturer';

interface Attestation {
  attestationResult: boolean;
  semester: number;
  attestationNumber: number;
}
export interface AttestationResult {
  name: string;
  attestations: Attestation[];
  lecturer: Lecturer;
}
