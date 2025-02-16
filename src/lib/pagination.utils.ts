import { range } from 'radash';

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const createPagesRange = ({
  currentPage,
  pagesCount,
  visibleRange,
}: {
  currentPage: number;
  pagesCount: number;
  visibleRange: number;
}) => {
  if (pagesCount <= visibleRange + 4) {
    return [...range(1, pagesCount)];
  }

  const halfOfVisibleRange = Math.floor(visibleRange / 2);

  const rangeStart =
    currentPage - halfOfVisibleRange > 3
      ? clamp(currentPage - halfOfVisibleRange, -Infinity, pagesCount - visibleRange - 1)
      : 1;

  const rangeEnd =
    currentPage + halfOfVisibleRange < pagesCount - 2
      ? clamp(currentPage + halfOfVisibleRange, visibleRange + 2, Infinity)
      : pagesCount;

  return [
    rangeStart > 1 ? [1, '...'] : [],
    ...range(rangeStart, rangeEnd),
    rangeEnd < pagesCount ? ['...', pagesCount] : [],
  ].flat();
};
