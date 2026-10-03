import { CuratorAttestationRow } from '../types';

export const groupAttestationResults = (results: CuratorAttestationRow[], by: 'student' | 'discipline') => {
  const groups = new Map<string, CuratorAttestationRow[]>();
  for (const result of results) {
    const key = by === 'student' ? String(result.studentId) : `${result.discipline.id}-${result.employeeId}`;
    const group = groups.get(key) ?? [];
    group.push(result);
    groups.set(key, group);
  }
  return Array.from(groups, ([key, results]) => ({ key, results }));
};
