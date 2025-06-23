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
      className={cn('flex cursor-pointer size-[12px] items-center justify-center focus:outline-hidden')}
    >
      <span
        className={cn(
          'duration-250 size-[8px] rounded-full border-2 border-basic-blue bg-basic-white transition-all',
          {
            'size-[12px] bg-basic-blue': selected,
          },
        )}
      ></span>
    </button>
  );
};
