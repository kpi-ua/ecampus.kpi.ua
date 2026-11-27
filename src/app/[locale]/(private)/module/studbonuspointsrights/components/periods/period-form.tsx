'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm, useWatch } from 'react-hook-form';

import { saveSbpPeriod } from '@/actions/sbp-periods.actions';
import { Paragraph } from '@/components/typography';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { EntityIdName } from '@/types/models/entity-id-name';
import { SbpPeriod, SbpPeriodRuleViolation } from '@/types/models/sbp-periods';

import { PeriodSummary } from './period-summary';
import { createPeriodFormSchema, PeriodFormValues } from './schema';
import { periodLabel, periodYear, toDay } from './utils';

const DATE_FIELDS = [
  'studentDateStart',
  'studentDateEnd',
  'operatorDateStart',
  'operatorDateEnd',
  'dateExport',
] as const;

interface Props {
  period?: SbpPeriod;
  studyYears: EntityIdName[];
  onClose: () => void;
  onSaved: () => void;
}

export const PeriodForm = ({ period, studyYears, onClose, onSaved }: Props) => {
  const t = useTranslations('private.studbonuspointsrights.periods');
  const { errorToast } = useServerErrorToast();

  const isCurrent = period?.state === 'Current';
  const yearLocked = isCurrent || !!period?.recordsCount;

  const form = useForm<PeriodFormValues>({
    resolver: zodResolver(createPeriodFormSchema(t)),
    defaultValues: {
      studyingYearId: period ? String(period.studyingYearId) : '',
      semester: period?.semester ?? 1,
      studentDateStart: toDay(period?.studentDateStart),
      studentDateEnd: toDay(period?.studentDateEnd),
      operatorDateStart: toDay(period?.operatorDateStart),
      operatorDateEnd: toDay(period?.operatorDateEnd),
      dateExport: toDay(period?.dateExport),
    },
  });

  const showViolation = (violation: SbpPeriodRuleViolation) => {
    const message = t(`errors.${violation.code}`, {
      period: violation.conflict ? periodLabel(t, violation.conflict) : '',
    });
    form.setError(violation.field || 'root', { message });
  };

  const saveMutation = useMutation({
    mutationFn: (values: PeriodFormValues) =>
      saveSbpPeriod(period?.id, { ...values, studyingYearId: Number(values.studyingYearId) }),
    onSuccess: (result) => (result.ok ? onSaved() : showViolation(result.violation)),
    onError: () => errorToast(),
  });

  const handleOpenChange = (open: boolean) => {
    if (!open && !saveMutation.isPending) {
      onClose();
    }
  };

  const handleSubmit = form.handleSubmit((values) => saveMutation.mutate(values));

  const values = useWatch({ control: form.control });
  const isLocked = (name: (typeof DATE_FIELDS)[number]) => isCurrent && name === 'studentDateStart';
  const pending = saveMutation.isPending;

  const description = isCurrent ? t('form.currentNote') : yearLocked ? t('form.recordsNote') : t('form.description');

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[704px]"
        overlayClassName="bg-neutral-900/10"
        showCloseButton={!pending}
      >
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <DialogHeader className="text-left">
              <DialogTitle className="pr-6 leading-6">{t(period ? 'form.edit' : 'form.add')}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <div className="grid items-start gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="studyingYearId"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel>{t('form.year')}</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange} disabled={yearLocked || pending}>
                      <FormControl>
                        <SelectTrigger variant="small" className="w-full">
                          <SelectValue placeholder={t('form.yearPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {studyYears.map((year) => (
                          <SelectItem key={year.id} value={String(year.id)}>
                            {periodYear(year.name)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="semester"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel>{t('form.semester')}</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={yearLocked || pending}
                    >
                      <FormControl>
                        <SelectTrigger variant="small" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">{t('form.firstSemester')}</SelectItem>
                        <SelectItem value="2">{t('form.secondSemester')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {DATE_FIELDS.map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="gap-1">
                      <FormLabel>{t(`form.${name}`)}</FormLabel>
                      <FormControl>
                        <Input {...field} size="small" type="date" disabled={isLocked(name) || pending} />
                      </FormControl>
                      {name === 'dateExport' && <FormDescription>{t('form.dateExportHint')}</FormDescription>}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <PeriodSummary values={values} />
            {form.formState.errors.root && (
              <Paragraph className="my-0 text-sm text-status-danger-300">
                {form.formState.errors.root.message}
              </Paragraph>
            )}
            <DialogFooter>
              <Button type="button" variant="secondary" disabled={pending} onClick={onClose}>
                {t('form.cancel')}
              </Button>
              <Button type="submit" loading={pending}>
                {t('form.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
