'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { Pencil, Save, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { updateBibliotekaIdentifier } from '@/actions/biblioteka.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { BibliotekaIdentifier } from '@/types/models/biblioteka';

import { bibliotekaQueryKeys } from '../query-keys';

interface Props {
  identifier: BibliotekaIdentifier;
  userAccountId: number;
  employeeId: number;
}

export const IdentifierRow = ({ identifier, userAccountId, employeeId }: Props) => {
  const t = useTranslations('private.biblioteka');
  const { errorToast } = useServerErrorToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(identifier.value ?? '');
  const { mutate: save, isPending } = useMutation({
    mutationFn: () => updateBibliotekaIdentifier(userAccountId, identifier.contactTypeId, value),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: bibliotekaQueryKeys.employee(userAccountId, employeeId) });
      setEditing(false);
    },
    onError: errorToast,
  });

  return (
    <TableRow>
      <TableCell>{identifier.name}</TableCell>
      <TableCell className="text-basic-blue">
        {editing ? (
          <Input className="min-w-64" value={value} onChange={(event) => setValue(event.target.value)} />
        ) : (
          identifier.value || '—'
        )}
      </TableCell>
      <TableCell className="text-neutral-500">
        {identifier.changedAt ? dayjs(identifier.changedAt).format('DD.MM.YYYY HH:mm:ss') : '—'}
      </TableCell>
      <TableCell>
        {editing ? (
          <div className="flex flex-wrap gap-3">
            <Button size="small" loading={isPending} onClick={() => save()}>
              <Save />
              {t('save')}
            </Button>
            <Button variant="tertiary" size="small" onClick={() => setEditing(false)}>
              <X />
            </Button>
          </div>
        ) : (
          <Button variant="secondary" size="small" onClick={() => setEditing(true)}>
            <Pencil />
            {t('table.edit')}
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
