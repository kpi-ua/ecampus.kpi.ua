'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { Pencil, Save, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { updateLibraryIdentifier } from '@/actions/library.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TableCell, TableRow } from '@/components/ui/table';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { LibraryIdentifier } from '@/types/models/library';

import { libraryQueryKeys } from '../query-keys';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  identifier: LibraryIdentifier;
  userAccountId: number;
  employeeId: number;
}

export const IdentifierRow = ({ identifier, userAccountId, employeeId }: Props) => {
  const t = useTranslations('private.library');
  const { errorToast } = useServerErrorToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(identifier.value ?? '');
  const { mutate: save, isPending } = useMutation({
    mutationFn: () => updateLibraryIdentifier(userAccountId, identifier.contactTypeId, value),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: libraryQueryKeys.employee(userAccountId, employeeId) });
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
        {identifier.changedAt ? dayjs.utc(identifier.changedAt).tz('Europe/Kyiv').format('DD.MM.YYYY HH:mm:ss') : '—'}
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
