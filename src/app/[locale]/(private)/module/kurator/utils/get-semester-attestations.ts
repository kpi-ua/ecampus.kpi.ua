import { ATTESTATION_RESULT } from '../constants';
import { CuratorAttestationStudent } from '../types';
import { groupAttestationResults } from './group-attestation-results';

export const getSemesterAttestations = (students: CuratorAttestationStudent[], semester: number) =>
  students.map((student) => {
    const results = student.results.filter((result) => result.semester === semester);
    return {
      ...student,
      results,
      attested: results.filter((row) => row.result === ATTESTATION_RESULT.Attested).length,
      missing: results.filter((row) => row.result === ATTESTATION_RESULT.Missing).length,
      notAttested: results.filter((row) => row.result === ATTESTATION_RESULT.NotAttested).length,
      notStudying: results.filter((row) => row.result === ATTESTATION_RESULT.NotStudying).length,
      notAttestedTwice: groupAttestationResults(results, 'discipline').filter(({ results }) =>
        results.some((result) => result.notAttestedTwice),
      ).length,
    };
  });
