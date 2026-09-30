export const LIBRARY_TAB = {
  DEPARTMENTS: 'departments',
  ALPHABET: 'alphabet',
} as const;

export type LibraryTab = (typeof LIBRARY_TAB)[keyof typeof LIBRARY_TAB];
