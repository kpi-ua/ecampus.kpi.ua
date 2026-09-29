import Link from 'next/link';

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
    aria-disabled={!value}
    tabIndex={value ? undefined : -1}
  >
    {value ?? '—'}
  </Link>
);
