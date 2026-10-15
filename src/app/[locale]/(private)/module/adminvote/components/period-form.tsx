'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';

import { createVoteTerm, updateVoteTerm } from '@/actions/vote-administration.actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { formatDate } from '@/lib/utils';
import { VoteAdminTerm } from '@/types/models/vote/administration';

import { voteAdministrationQueryKey } from '../query-keys';
import { createPeriodFormSchema, PeriodFormValues } from './schema';

interface Props {
  period?: VoteAdminTerm;
  periods: VoteAdminTerm[];
  onClose: () => void;
  onSaved: () => void;
}

export const PeriodForm = ({ period, periods, onClose, onSaved }: Props) => {
  const t = useTranslations('private.adminvote.periods.form');
  const { errorToast } = useServerErrorToast();
  const queryClient = useQueryClient();
  const hasResponses = !!period?.respondentCount;
  const currentYear = dayjs().year();
  const academicYear = dayjs().month() >= 8 ? currentYear : currentYear - 1;
  const studyYears = Array.from(
    new Set([
      ...Array.from({ length: 7 }, (_, index) => `${academicYear - 3 + index}-${academicYear - 2 + index}`),
      ...periods.map((item) => item.studyYear),
    ]),
  )
    .sort()
    .reverse();
  const form = useForm<PeriodFormValues>({
    resolver: zodResolver(createPeriodFormSchema(t, periods, period?.id)),
    defaultValues: {
      number: period ? String(period.number) : '',
      studyYear: period?.studyYear ?? `${academicYear}-${academicYear + 1}`,
      semester: period?.semester === 2 ? '2' : '1',
      startsOn: formatDate(period?.startsOn),
      endsOn: formatDate(period?.endsOn),
      resultsPublishOn: formatDate(period?.resultsPublishOn),
    },
  });
  const saveMutation = useMutation({
    mutationFn: async (values: PeriodFormValues) => {
      const request = { ...values, number: Number(values.number), semester: Number(values.semester) };
      if (period) {
        await updateVoteTerm(period.id, request);
      } else {
        await createVoteTerm(request);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: voteAdministrationQueryKey });
      onSaved();
    },
    onError: () => errorToast(),
  });
  const handleOpenChange = (open: boolean) => {
    if (!open && !saveMutation.isPending) {
      onClose();
    }
  };
  const handleSubmit = form.handleSubmit((values) => saveMutation.mutate(values));

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-[704px]"
        overlayClassName="bg-neutral-900/10"
        showCloseButton={!saveMutation.isPending}
      >
        <Form {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            <DialogHeader className="text-left">
              <DialogTitle className="pr-6 leading-6">{t(period ? 'edit' : 'add')}</DialogTitle>
              <DialogDescription>{t(hasResponses ? 'responses-note' : 'description')}</DialogDescription>
            </DialogHeader>
            <div className="grid items-start gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel>{t('number')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        size="small"
                        type="number"
                        min={1}
                        step={1}
                        placeholder={t('number-placeholder')}
                        disabled={hasResponses || saveMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studyYear"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel>{t('year')}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={hasResponses || saveMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger variant="small" className="w-full">
                          <SelectValue placeholder={t('year-placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {studyYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
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
                    <FormLabel>{t('semester')}</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={hasResponses || saveMutation.isPending}
                    >
                      <FormControl>
                        <SelectTrigger variant="small" className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">{t('first-semester')}</SelectItem>
                        <SelectItem value="2">{t('second-semester')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {(['startsOn', 'endsOn', 'resultsPublishOn'] as const).map((name) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="gap-1">
                      <FormLabel>{t(name)}</FormLabel>
                      <FormControl>
                        <Input {...field} size="small" type="date" disabled={saveMutation.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" disabled={saveMutation.isPending} onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button type="submit" loading={saveMutation.isPending}>
                {t('save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
