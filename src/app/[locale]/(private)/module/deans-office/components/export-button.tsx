'use client';

import { useMutation } from '@tanstack/react-query';
import { useLocale } from 'next-intl';
import qs from 'query-string';

import { Button } from '@/components/ui/button';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { saveAsBlob } from '@/lib/save-as-blob';

export function ExportButton({
  kind,
  query,
  label,
}: {
  kind: 'roster' | 'groups' | 'reports';
  query?: Record<string, number | null>;
  label: string;
}) {
  const locale = useLocale();
  const { errorToast } = useServerErrorToast();
  const exportMutation = useMutation({
    mutationFn: async () => {
      const url = qs.stringifyUrl(
        { url: `/api/deans-office/export/${kind}`, query: { ...query, locale } },
        { skipNull: true },
      );
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Ekanat export failed: ${response.status}`);
      }

      await saveAsBlob(response, `deans-office-${kind}.csv`);
    },
    onError: () => errorToast(),
  });

  return (
    <Button
      type="button"
      variant="secondary"
      loading={exportMutation.isPending}
      onClick={() => exportMutation.mutate()}
    >
      {label}
    </Button>
  );
}
