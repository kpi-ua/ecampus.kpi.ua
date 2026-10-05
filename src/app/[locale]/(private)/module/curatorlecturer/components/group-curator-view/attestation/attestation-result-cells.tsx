import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';
import { Show } from '@/components/utils/show';

import { CuratorAttestationRow } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { ATTESTATION_COLUMNS } from '@/app/[locale]/(private)/module/curatorlecturer/constants';

interface Props {
  results: CuratorAttestationRow[];
}

export const AttestationResultCells = ({ results }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.results');

  return ATTESTATION_COLUMNS.map((status) => {
    const count = results.filter((result) => result.result === status.result).length;
    return (
      <TableCell key={status.label}>
        <Show when={count > 0} fallback="—">
          <Badge variant={status.variant}>
            {count > 1 ? `${count} ` : ''}
            {t(status.code)}
          </Badge>
        </Show>
      </TableCell>
    );
  });
};
