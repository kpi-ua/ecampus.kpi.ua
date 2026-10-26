import Link from 'next/link';

import { EMPTY_VALUE } from '@/lib/constants/common';

interface Props {
  value: string | null;
  href: string;
}

export const IdentifierLink = ({ value, href }: Props) => (
  <Link
    className={
      value ? 'text-basic-blue hover:underline' : 'pointer-events-none cursor-text text-neutral-400 no-underline'
    }
    href={value ? href + encodeURIComponent(value) : '#'}
    target="_blank"
    rel="noreferrer"
  >
    {value ?? EMPTY_VALUE}
  </Link>
);
