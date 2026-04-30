'use client';

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';
import { grantSbpRights } from '@/actions/sbp-rights.actions';
import {
  AccessScope,
  SbpLoadCatalogItem,
  SbpStudyYearCatalogItem,
  SbpSubdivisionCatalogItem,
} from '@/types/models/sbp-rights';
import { GrantRightsFormValues, grantRightsSchema } from './grant-rights-schema';
import { LoadMultiSelect } from './load-multi-select';
import { UserAutocomplete } from './user-autocomplete';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loads: SbpLoadCatalogItem[];
  subdivisions: SbpSubdivisionCatalogItem[];
  years: SbpStudyYearCatalogItem[];
}

export function GrantRightsDialog({ open, onOpenChange, loads, subdivisions, years }: Props) {
  const t = useTranslations('private.studbonuspointsrights.grant');
  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();

  const facultyOptions = useMemo(
    () => subdivisions.filter((s) => !s.isUniversityWide),
    [subdivisions],
  );
  const currentYear = useMemo(() => years.find((y) => y.isCurrent) ?? years[0], [years]);

  const form = useForm<GrantRightsFormValues>({
    resolver: zodResolver(grantRightsSchema),
    defaultValues: {
      userAccountId: 0,
      scope: 'Faculty',
      subdivisionId: undefined,
      studyingYearId: currentYear?.id ?? 0,
      loadIds: [],
    },
    mode: 'onChange',
  });

  // Reset the form whenever the dialog opens so a previous draft doesn't
  // bleed into the next session.
  useEffect(() => {
    if (open) {
      form.reset({
        userAccountId: 0,
        scope: 'Faculty',
        subdivisionId: undefined,
        studyingYearId: currentYear?.id ?? 0,
        loadIds: [],
      });
    }
  }, [open, currentYear?.id, form]);

  const scope = form.watch('scope');

  const onSubmit = async (values: GrantRightsFormValues) => {
    try {
      const result = await grantSbpRights({
        userAccountId: values.userAccountId,
        scope: values.scope,
        subdivisionId: values.scope === 'University' ? undefined : values.subdivisionId,
        studyingYearId: values.studyingYearId,
        loadIds: values.loadIds,
      });
      toast({
        title: t('success.title'),
        description: t('success.description', {
          granted: result.createdIds.length,
          skipped: result.skippedDuplicates.length,
        }),
      });
      onOpenChange(false);
    } catch {
      errorToast();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="userAccountId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t('user')}</FormLabel>
                  <FormControl>
                    <UserAutocomplete
                      value={field.value || undefined}
                      onChange={(id) => field.onChange(id)}
                    />
                  </FormControl>
                  {fieldState.error && <FormMessage>{t(fieldState.error.message ?? '')}</FormMessage>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scope"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('scope')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={(v) => field.onChange(v as AccessScope)}
                      className="flex gap-4"
                    >
                      <label className="flex items-center gap-2">
                        <RadioGroupItem value="Faculty" />
                        {t('scopeFaculty')}
                      </label>
                      <label className="flex items-center gap-2">
                        <RadioGroupItem value="University" />
                        {t('scopeUniversity')}
                      </label>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />

            {scope === 'Faculty' && (
              <FormField
                control={form.control}
                name="subdivisionId"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>{t('subdivision')}</FormLabel>
                    <Select
                      value={field.value ? String(field.value) : ''}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('subdivisionPlaceholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {facultyOptions.map((s) => (
                          <SelectItem key={s.id} value={String(s.id)}>
                            {s.abbreviation ?? s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FormMessage>{t(fieldState.error.message ?? '')}</FormMessage>}
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="studyingYearId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t('year')}</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('yearPlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y.id} value={String(y.id)}>
                          {y.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FormMessage>{t(fieldState.error.message ?? '')}</FormMessage>}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="loadIds"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t('loads')}</FormLabel>
                  <FormControl>
                    <LoadMultiSelect loads={loads} value={field.value} onChange={field.onChange} />
                  </FormControl>
                  {fieldState.error && <FormMessage>{t(fieldState.error.message ?? '')}</FormMessage>}
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={form.formState.isSubmitting}>
                {t('submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
