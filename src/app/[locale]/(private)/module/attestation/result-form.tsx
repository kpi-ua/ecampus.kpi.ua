'use client';

import { useTranslations } from 'next-intl';
import { startTransition, useActionState, useOptimistic } from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SaveState = { status: number; saved: boolean } | null;

export function ResultForm({
  save,
  student,
  result,
}: {
  save: (previousState: SaveState, data: FormData) => Promise<SaveState>;
  student: string;
  result: string | null;
}) {
  const t = useTranslations('private.lecturer-attestation');
  const [state, action, pending] = useActionState(save, null);
  const [selected, setSelected] = useOptimistic(result ?? '');

  function update(value: string) {
    const data = new FormData();
    data.set('result', value);
    startTransition(() => {
      setSelected(value);
      action(data);
    });
  }

  return (
    <div className="grid gap-1">
      <Select value={selected} onValueChange={update} disabled={pending}>
        <SelectTrigger className="h-8 w-full min-w-36 px-2 py-0" aria-label={t('result', { student })}>
          <SelectValue placeholder="—" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">{t('a')}</SelectItem>
          <SelectItem value="na">{t('na')}</SelectItem>
          <SelectItem value="nv">{t('nv')}</SelectItem>
        </SelectContent>
      </Select>
      {!pending && state && !state.saved && (
        <span role="alert" className="text-xs">
          {t('save-error')} (HTTP {state.status})
        </span>
      )}
    </div>
  );
}
