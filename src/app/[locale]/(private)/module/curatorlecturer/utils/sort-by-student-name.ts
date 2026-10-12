export const sortByStudentName = <T>(students: readonly T[], getFullName: (student: T) => string): T[] =>
  [...students].sort((first, second) => getFullName(first).localeCompare(getFullName(second), 'uk'));
