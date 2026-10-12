export const curatorAdministrationQueryKeys = {
  groups: ['curatorlecturer', 'administration', 'groups'] as const,
  assignments: (groupId: number) => ['curatorlecturer', 'administration', groupId, 'assignments'] as const,
};
