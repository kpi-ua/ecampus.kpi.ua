import { cn } from '@/lib/utils';

interface DotButtonProps {
  selected?: boolean;
  onClick: () => void;
}

export const DotButton = ({ selected = false, onClick }: DotButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('flex size-[12px] items-center justify-center rounded-full bg-basic-blue focus:outline-none', {
        'bg-transparent': !selected,
      })}
    >
      <span className={cn('block size-[8px] rounded-full border-[2px] border-basic-blue', { 'bg-white': !selected })} />
    </button>
  );
};
