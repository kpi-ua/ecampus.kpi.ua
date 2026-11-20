import { getLocale } from 'next-intl/server';
import qs from 'query-string';

import { Button } from '@/components/ui/button';

export async function DeansOfficeExport({
  kind,
  query,
  label,
}: {
  kind: 'roster' | 'groups' | 'reports';
  query: Record<string, number | null>;
  label: string;
}) {
  const locale = await getLocale();
  const url = qs.stringifyUrl({ url: `/api/deans-office/export/${kind}`, query: { ...query, locale } }, { skipNull: true });
  return (
    <Button asChild variant="secondary">
      <a href={url}>{label}</a>
    </Button>
  );
}
