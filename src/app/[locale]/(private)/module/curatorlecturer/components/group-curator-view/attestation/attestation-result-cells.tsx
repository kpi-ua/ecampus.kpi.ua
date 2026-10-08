import { useTranslations } from 'next-intl';

import { ATTESTATION_COLUMNS } from '@/app/[locale]/(private)/module/curatorlecturer/constants';
import { CuratorAttestationTotals } from '@/app/[locale]/(private)/module/curatorlecturer/types';
import { Badge } from '@/components/ui/badge';
import { TableCell } from '@/components/ui/table';
import { Show } from '@/components/utils/show';
import { EMPTY_VALUE } from '@/lib/constants/empty-value';

interface Props {
  totals: CuratorAttestationTotals;
}

export const AttestationResultCells = ({ totals }: Props) => {
  const t = useTranslations('private.curatorlecturer.group-curator.results');

  return ATTESTATION_COLUMNS.map((status) => {
    const count = totals[status.key];
    return (
      <TableCell key={status.label}>
        <Show when={count > 0} fallback={EMPTY_VALUE}>
          <Badge variant={status.variant}>
            {count > 1 ? `${count} ` : ''}
            {t(status.code)}
          </Badge>
        </Show>
      </TableCell>
    );
  });
};
