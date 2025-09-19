'use client';

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
    <div className="border-neutral-divider border-solid not-last:mb-4 not-last:border-b not-last:pb-4">
      <strong className="my-1 block text-lg">{group}</strong>
      <Link
        className={cn('my-1 flex items-center gap-2 text-xl', { 'text-basic-black pointer-events-none': !link })}
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
