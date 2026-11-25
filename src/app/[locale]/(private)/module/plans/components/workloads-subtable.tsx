import { Pencil, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type PlanLoad } from '@/types/models/plans';

export interface WorkloadTableActions {
  busy: boolean;
  editId: number | null;
  editHours: string;
  onEdit: (load: PlanLoad) => void;
  onCancelEdit: () => void;
  onHoursChange: (hours: string) => void;
  onSave: (id: number, hours: number) => void;
  onDelete: (id: number) => void;
}

interface Props extends WorkloadTableActions {
  loads: PlanLoad[];
}

export const WorkloadsSubtable = ({
  loads,
  busy,
  editId,
  editHours,
  onEdit,
  onCancelEdit,
  onHoursChange,
  onSave,
  onDelete,
}: Props) => {
  const t = useTranslations('private.plans');
  const handleHoursChange = (event: ChangeEvent<HTMLInputElement>) => onHoursChange(event.target.value);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('groups')}</TableHead>
          <TableHead>{t('loadType')}</TableHead>
          <TableHead>{t('plannedHours')}</TableHead>
          <TableHead>{t('actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loads.map((load) => (
          <TableRow key={load.id}>
            <TableCell>{load.group}</TableCell>
            <TableCell>{load.loadType}</TableCell>
            <TableCell>
              {editId === load.id ? (
                <Input
                  className="min-w-24"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.1"
                  value={editHours}
                  onChange={handleHoursChange}
                />
              ) : (
                load.plannedHours.toLocaleString()
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                {editId === load.id ? (
                  <>
                    <Button
                      type="button"
                      size="small"
                      loading={busy}
                      disabled={editHours === '' || Number(editHours) < 0 || Number(editHours) > 1000}
                      onClick={() => onSave(load.id, Number(editHours))}
                    >
                      {t('save')}
                    </Button>
                    <Button type="button" size="small" variant="tertiary" onClick={onCancelEdit}>
                      {t('cancel')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      size="small"
                      variant="tertiary"
                      icon={<Pencil />}
                      title={t('editHours')}
                      onClick={() => onEdit(load)}
                    >
                      {t('edit')}
                    </Button>
                    <Button
                      type="button"
                      size="small"
                      variant="tertiary"
                      icon={<Trash2 />}
                      title={t('delete')}
                      onClick={() => onDelete(load.id)}
                    >
                      {t('delete')}
                    </Button>
                  </>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
