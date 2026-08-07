'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
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
import { useRouter } from '@/i18n/routing';
import { grantSbpRights } from '@/actions/sbp-rights.actions';
import {
  AccessScope,
  SbpLoadCatalogItem,
  SbpStudyYearCatalogItem,
  SbpSubdivisionCatalogItem,
} from '@/types/models/sbp-rights';
import { GrantRightsFormValues, grantRightsSchema } from './grant-rights-schema';
import { LoadMultiSelect } from './load-multi-select';
import { PickedUser, UserPicker } from './user-picker';

const LIST_PATH = '/module/studbonuspointsrights';

interface Props {
  loads: SbpLoadCatalogItem[];
  subdivisions: SbpSubdivisionCatalogItem[];
  years: SbpStudyYearCatalogItem[];
}

export function GrantForm({ loads, subdivisions, years }: Props) {
  const t = useTranslations('private.studbonuspointsrights.grant');
  const { toast } = useToast();
  const { errorToast } = useServerErrorToast();
  const router = useRouter();

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

  const scope = form.watch('scope');
  const [selectedUser, setSelectedUser] = useState<PickedUser | null>(null);

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
      router.push(LIST_PATH);
    } catch {
      errorToast();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="userAccountId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>{t('user')}</FormLabel>
                  <UserPicker
                    value={selectedUser}
                    onChange={(user) => {
                      setSelectedUser(user);
                      field.onChange(user?.id ?? 0);
                    }}
                  />
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
                    value={field.value ? String(field.value) : undefined}
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
          </div>

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
        </div>

        <div className="flex gap-2">
          <Button type="submit" variant="primary" disabled={form.formState.isSubmitting}>
            {t('submit')}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push(LIST_PATH)}>
            {t('cancel')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
