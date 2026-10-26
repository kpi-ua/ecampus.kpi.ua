import { useTranslations } from 'next-intl';

import { TableCell, TableRow } from '@/components/ui/table';

interface Props {
  colSpan: number;
}

export const EmptyTableRow = ({ colSpan }: Props) => {
  const t = useTranslations('private.k-7.preview.table');

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-8 text-center text-xs text-neutral-500">
        {t('empty')}
      </TableCell>
    </TableRow>
  );
};
