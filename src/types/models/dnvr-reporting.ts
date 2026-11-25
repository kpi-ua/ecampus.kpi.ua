export interface DnvrStudentCount {
  faculty: string;
  facultyAbbreviation: string;
  course: number;
  educationLevel: string;
  studentCount: number;
  facultyId: number | null;
  educationLevelId: number | null;
  disciplineAndGroup: string | null;
}

export enum DnvrAttestationReport {
  FullyAttested = 'FullyAttested',
  FullyUnattested = 'FullyUnattested',
  ThreeOrMoreFailures = 'ThreeOrMoreFailures',
  MissingWorkload = 'MissingWorkload',
  MissingAttestation = 'MissingAttestation',
}
