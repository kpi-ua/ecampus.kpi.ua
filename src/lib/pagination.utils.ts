import { clamp, flatten, range } from 'lodash';

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
    return range(1, pagesCount + 1);
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

  return flatten([
    rangeStart > 1 ? [1, '...'] : [],
    ...range(rangeStart, rangeEnd + 1),
    rangeEnd < pagesCount ? ['...', pagesCount] : [],
  ]);
};
