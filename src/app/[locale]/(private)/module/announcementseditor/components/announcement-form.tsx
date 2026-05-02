'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MultipleSelector from '@/components/ui/multi-select';
import { formSchema } from './schema';
import { Textarea } from '@/components/ui/textarea';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

export type AnnouncementFormValues = z.infer<typeof formSchema>;

const emptyValues: AnnouncementFormValues = {
  announcement: {
    title: '',
    description: '',
    image: '',
    link: {
      title: '',
      uri: '',
    },
    start: '',
    end: '',
    language: 'uk',
  },
  filter: {
    roles: [],
    studyForms: [],
    courses: [],
  },
};

const EmptyIndicator = () => {
  const t = useTranslations('private.announcementseditor.form');
  return <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">{t('not-found')}</p>;
};

interface Props {
  rolesData: string[];
  studyFormsData: string[];
  coursesData: number[];
  initialValues?: AnnouncementFormValues;
  onSubmit: (values: AnnouncementFormValues) => Promise<void>;
}

export function AnnouncementForm({
  rolesData,
  studyFormsData,
  coursesData,
  initialValues,
  onSubmit,
}: Props) {
  const t = useTranslations('private.announcementseditor.form');
  const { errorToast } = useServerErrorToast();
  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues ?? emptyValues,
  });

  async function submitForm(values: AnnouncementFormValues) {
    try {
      await onSubmit(values);
    } catch {
      errorToast();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitForm)} className="mx-auto flex flex-col gap-3">
        <FormField
          control={form.control}
          name="announcement.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.title')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholders.title')} type="text" maxLength={100} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="announcement.description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.description')}</FormLabel>
              <FormControl>
                <Textarea placeholder={t('placeholders.description')} rows={4} maxLength={700} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="announcement.image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.imageUrl')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholders.imageUrl')} type="text" maxLength={500} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="announcement.link.title"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <FormLabel>{t('fields.linkTitle')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.linkTitle')} type="text" maxLength={30} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="announcement.link.uri"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <FormLabel>{t('fields.linkUrl')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('placeholders.linkUrl')} type="text" maxLength={500} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="announcement.start"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <FormLabel>{t('fields.startDate')}</FormLabel>
                <Input type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="announcement.end"
            render={({ field }) => (
              <FormItem className="flex flex-1 flex-col">
                <FormLabel>{t('fields.endDate')}</FormLabel>
                <Input type="date" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="announcement.language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.language')}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('placeholders.language')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="uk">{t('languages.uk')}</SelectItem>
                  <SelectItem value="en">{t('languages.en')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="filter.studyForms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.studyForms')}</FormLabel>
              <FormControl>
                <MultipleSelector
                  value={(field.value ?? []).map((v) => ({ value: v, label: v }))}
                  defaultOptions={studyFormsData.map((studyForm) => ({ value: studyForm, label: studyForm }))}
                  placeholder={t('placeholders.studyForms')}
                  onChange={(options) => field.onChange(options.map((option) => option.value as string))}
                  emptyIndicator={<EmptyIndicator />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="filter.roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.roles')}</FormLabel>
              <FormControl>
                <MultipleSelector
                  value={(field.value ?? []).map((v) => ({ value: v, label: v }))}
                  defaultOptions={rolesData.map((role) => ({ value: role, label: role }))}
                  placeholder={t('placeholders.roles')}
                  onChange={(options) => field.onChange(options.map((option) => option.value as string))}
                  emptyIndicator={<EmptyIndicator />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="filter.courses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.courses')}</FormLabel>
              <FormControl>
                <MultipleSelector
                  value={(field.value ?? []).map((v) => ({ value: v.toString(), label: v.toString() }))}
                  defaultOptions={coursesData.map((course) => ({ value: course.toString(), label: course.toString() }))}
                  placeholder={t('placeholders.courses')}
                  onChange={(options) => field.onChange(options.map((option) => parseInt(option.value as string)))}
                  emptyIndicator={<EmptyIndicator />}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4" loading={form.formState.isSubmitting}>
          {t('buttons.submit')}
        </Button>
      </form>
    </Form>
  );
}
