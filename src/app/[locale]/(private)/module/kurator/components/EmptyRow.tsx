import { useTranslations } from 'next-intl';
import { TableCell, TableRow } from '@/components/ui/table';

export const EmptyRow = ({ colSpan }: { colSpan: number }) => {
  const t = useTranslations('private.curator.lecturer.group-curator');

  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-12 text-center text-neutral-500">
        {t('results.empty')}
      </TableCell>
    </TableRow>
  );
};
