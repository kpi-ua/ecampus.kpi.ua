import { Journal } from '@/types/models/current-control/journal';
import { round } from '@/app/[locale]/(private)/module/studysheet/[id]/math';

export const getTotalScore = (journal: Journal[]) => {
  const totalScore = journal.reduce((acc, entry) => {
    const score = typeof entry.score === 'number' ? entry.score : 0;
    return acc + score;
  }, 0);
  return round(totalScore, 2)
}
