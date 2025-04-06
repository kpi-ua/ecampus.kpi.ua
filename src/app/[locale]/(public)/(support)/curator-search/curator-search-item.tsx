import { LinkSimple } from '@/app/images';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CuratorSearchItemProps {
  group: string;
  department: string;
  curatorName: string;
  link?: string;
}

export const CuratorSearchItem = ({ group, department, curatorName, link }: CuratorSearchItemProps) => {
  return (
    <div className="border-solid border-neutral-divider [&:not(:last-child)]:mb-4 [&:not(:last-child)]:border-b-[1px] [&:not(:last-child)]:pb-4">
      <strong className="my-1 block text-lg">{group}</strong>
      <Link
        className={cn('my-1 flex items-center gap-2 text-xl', { 'pointer-events-none text-basic-black': !link })}
        href={link ?? '#'}
        target="_blank"
      >
        {curatorName}
        {!!link && <LinkSimple />}
      </Link>
      <span className="my-1 text-base text-neutral-600">{department}</span>
    </div>
  );
};
