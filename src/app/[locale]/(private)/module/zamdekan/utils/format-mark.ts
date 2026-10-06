export const formatZamdekanMark = (
  mark: number | null | undefined,
  translate: (key: string) => string,
): string | number => {
  if (mark === null || mark === undefined) return '';
  if (mark === 101) return translate('values.not-admitted');
  if (mark === 102) return translate('values.not-graded');
  return mark;
};
