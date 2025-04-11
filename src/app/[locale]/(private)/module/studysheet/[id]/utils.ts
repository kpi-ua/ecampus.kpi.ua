import { Journal } from '@/types/models/current-control/journal';

export const getTotalScore = (journal: Journal[]) =>
  journal.reduce((acc, entry) => {
    const score = typeof entry.score === 'number' ? entry.score : 0;
    return acc + score;
  }, 0);
