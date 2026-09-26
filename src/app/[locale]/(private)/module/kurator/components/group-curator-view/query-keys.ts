export const CURATOR_GROUP_STALE_TIME = 5 * 60 * 1000;

export const curatorGroupQueryKeys = {
  students: (groupId: number) => ['curator', 'group', groupId, 'students'] as const,
  credentials: (groupId: number) => ['curator', 'group', groupId, 'credentials'] as const,
  attestations: (groupId: number, yearId?: number, semester?: number, attestationId?: number) =>
    ['curator', 'group', groupId, 'attestations', { yearId, semester, attestationId }] as const,
  surveys: (groupId: number) => ['curator', 'group', groupId, 'active-survey'] as const,
};
