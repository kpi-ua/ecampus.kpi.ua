'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createVoteCriterion, updateVoteCriterion } from '@/actions/vote-administration.actions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { VoteAdminCriterion } from '@/types/models/vote/administration';

import { voteAdministrationQueryKey } from '../query-keys';

interface Props {
  criterion?: VoteAdminCriterion;
  onClose: () => void;
  onSaved: () => void;
}
const MAX_COEFFICIENT = 1;
export const CriterionForm = ({ criterion, onClose, onSaved }: Props) => {
  const t = useTranslations('private.adminvote.form');
  const { errorToast } = useServerErrorToast();
  const queryClient = useQueryClient();

  const formSchema = z.object({
    name: z.string().trim().min(1, t('validation.name')).max(255, t('validation.name-length')),
    coefficient: z
      .string()
      .trim()
      .min(1, t('validation.coefficient'))
      .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, t('validation.coefficient'))
      .refine((value) => {
        const coefficient = Number(value);
        if (!Number.isFinite(coefficient) || coefficient <= 0) return true;
        return coefficient <= MAX_COEFFICIENT;
      }, t('validation.coefficients-total')),
  });
  type FormValues = z.infer<typeof formSchema>;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: criterion?.name ?? '', coefficient: criterion ? String(criterion.coefficient) : '1' },
  });

  const saveMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const request = { name: values.name, coefficient: Number(values.coefficient) };
      if (criterion) {
        await updateVoteCriterion(criterion.id, request);
      } else {
        await createVoteCriterion(request);
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
              <DialogTitle className="pr-6 leading-6">{t(criterion ? 'edit' : 'add')}</DialogTitle>
              <DialogDescription className={criterion ? undefined : 'sr-only'}>{t('history-note')}</DialogDescription>
            </DialogHeader>
            <div className="grid items-start gap-4 sm:grid-cols-[minmax(0,1fr)_160px]">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel className="text-sm leading-4">{t('name')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        size="small"
                        placeholder={t('placeholders.name')}
                        maxLength={255}
                        disabled={saveMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coefficient"
                render={({ field }) => (
                  <FormItem className="gap-1">
                    <FormLabel className="text-sm leading-4">{t('coefficient')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        size="small"
                        placeholder={t('placeholders.coefficient')}
                        type="number"
                        min={0}
                        max={MAX_COEFFICIENT}
                        step="any"
                        disabled={saveMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" disabled={saveMutation.isPending} onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button type="submit" loading={saveMutation.isPending}>
                {t(criterion ? 'save' : 'add')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
