import { cn } from '@/lib/utils';

interface Props {
  label: string;
  secondary?: boolean;
}

export function HeaderLabel({ label, secondary = false }: Props) {
  return <span className={cn('block whitespace-nowrap leading-tight', secondary && 'text-neutral-700')}>{label}</span>;
}
