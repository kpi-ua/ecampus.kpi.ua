import { SpinnerGap } from '@/app/images';
import { TableCell, TableRow } from '@/components/ui/table';

interface Props {
  colSpan: number;
}

export const LoadingRow = ({ colSpan }: Props) => (
  <TableRow>
    <TableCell colSpan={colSpan} className="h-32">
      <div className="flex items-center justify-center">
        <SpinnerGap className="text-basic-blue size-8" />
      </div>
    </TableCell>
  </TableRow>
);
