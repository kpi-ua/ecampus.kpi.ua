'use client';

import { useTranslations } from 'next-intl';
import { type FormEvent, useId, useState } from 'react';

import { updateDnvrSheetSchedule } from '@/actions/dnvr-sheets.actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { useToast } from '@/hooks/use-toast';
import { type DnvrSheetKind, type DnvrSheetSummary } from '@/types/models/dnvr-sheets';

const dateFields = [
  ['startsAt', 'opensAt'],
  ['examAt', 'examAt'],
  ['locksAt', 'locksAt'],
] as const;
const flags = [
  ['isBlocked', 'blockedSheet'],
  ['isDeleted', 'deletedSheet'],
] as const;

export function SheetScheduleForm({ kind, sheet }: { kind: DnvrSheetKind; sheet: DnvrSheetSummary }) {
  const t = useTranslations('private.dnvr-reporting');
  const { errorToast } = useServerErrorToast();
  const { toast } = useToast();
  const [pending, setPending] = useState(false);
  const id = useId();

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) {
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const startsAt = String(data.get('startsAt') ?? '');
    const examAt = String(data.get('examAt') ?? '');
    const locksAt = String(data.get('locksAt') ?? '');
    const reason = String(data.get('reason') ?? '').trim();
    if (!reason || startsAt > examAt || examAt > locksAt) {
      toast({ variant: 'destructive', title: t('invalidSchedule') });
      return;
    }

    setPending(true);
    try {
      const updated = await updateDnvrSheetSchedule(kind, sheet.id, {
        startsAt,
        examAt,
        locksAt,
        isBlocked: data.has('isBlocked'),
        isDeleted: data.has('isDeleted'),
        reason,
      });
      if (!updated) {
        errorToast();
        return;
      }

      const reasonInput = form.elements.namedItem('reason');
      if (reasonInput instanceof HTMLInputElement) {
        reasonInput.value = '';
      }
      toast({ title: t('scheduleSaved') });
    } catch {
      errorToast();
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex max-w-md flex-col gap-4">
      {dateFields.map(([name, label]) => (
        <div className="flex flex-col gap-2" key={name}>
          <Label htmlFor={id + name}>{t(label)}</Label>
          <Input
            id={id + name}
            name={name}
            type="datetime-local"
            step={1}
            required
            defaultValue={sheet[name]?.slice(0, 19) ?? ''}
            disabled={pending}
          />
        </div>
      ))}
      {flags.map(([name, label]) => (
        <div className="flex items-center gap-2" key={name}>
          <Checkbox id={id + name} name={name} defaultChecked={sheet[name]} disabled={pending} />
          <Label htmlFor={id + name}>{t(label)}</Label>
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <Label htmlFor={id + 'reason'}>{t('reason')}</Label>
        <Input id={id + 'reason'} name="reason" maxLength={50} required disabled={pending} />
      </div>
      <Button type="submit" loading={pending} className="self-start">
        {t('saveSchedule')}
      </Button>
    </form>
  );
}
