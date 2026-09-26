import Link from 'next/link';

interface Props {
  value: string | null;
  href: string;
}

export const IdentifierLink = ({ value, href }: Props) =>
  value ? (
    <Link
      className="text-basic-blue hover:underline"
      href={href + encodeURIComponent(value)}
      target="_blank"
      rel="noreferrer"
    >
      {value}
    </Link>
  ) : (
    <span className="text-neutral-400">—</span>
  );
