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
      className={cn('flex size-[12px] cursor-pointer items-center justify-center focus:outline-hidden')}
    >
      <span
        className={cn('border-basic-blue bg-basic-white size-[8px] rounded-full border-2 transition-all duration-250', {
          'bg-basic-blue size-[12px]': selected,
        })}
      ></span>
    </button>
  );
};
