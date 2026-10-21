import CaretDown from '@/app/images/icons/CaretDown.svg';
import CaretUp from '@/app/images/icons/CaretUp.svg';

export function SortIcon({ dir }: { dir: 'asc' | 'desc' | null }) {
  if (!dir) {
    return null;
  }
  return dir === 'asc' ? <CaretUp className="inline-block" /> : <CaretDown className="inline-block" />;
}
