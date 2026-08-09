import { TableCell, TableRow } from '@/components/ui/table';

interface Props {
  colSpan: number;
}

export const EmptyTableRow = ({ colSpan }: Props) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="py-8 text-center text-xs text-neutral-500">
      Немає даних
    </TableCell>
  </TableRow>
);
