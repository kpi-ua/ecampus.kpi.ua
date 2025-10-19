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
import { Group } from '@/types/models/group';
import { Subdivision } from '@/types/models/subdivision';
import { formSchema } from '@/app/[locale]/(private)/module/announcements/components/schema';
import { Textarea } from '@/components/ui/textarea';
import { createAnnouncement } from '@/actions/announcement.actions';
import { useServerErrorToast } from '@/hooks/use-server-error-toast';

interface Props {
  rolesData: string[];
  studyFormsData: string[];
  groupsData: Group[];
  subdivisionsData: Subdivision[];
  coursesData: number[];
  onSuccess: (id: number) => void;
  onCancel: () => void;
}

export function AnnouncementForm({ rolesData, studyFormsData, groupsData, subdivisionsData, coursesData, onSuccess, onCancel }: Props) {
  const t = useTranslations('private.announcements.form');
  const { errorToast } = useServerErrorToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
        groups: [],
        studyForms: [],
        subdivisions: [],
        courses: [],
      },
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const id = await createAnnouncement(values);
      onSuccess(id);
    } catch (error) {
      errorToast();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto gap-3 flex flex-col">
        <FormField
          control={form.control}
          name="announcement.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.title')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholders.title')} type="text" {...field} />
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
                <Textarea placeholder={t('placeholders.description')} rows={4} {...field} />
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
                <Input placeholder={t('placeholders.imageUrl')} type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="announcement.link.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.linkTitle')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholders.linkTitle')} type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="announcement.link.uri"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.linkUrl')}</FormLabel>
              <FormControl>
                <Input placeholder={t('placeholders.linkUrl')} type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="announcement.start"
          render={({ field }) => (
            <FormItem className="flex flex-col">
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
            <FormItem className="flex flex-col">
              <FormLabel>{t('fields.endDate')}</FormLabel>
              <Input type="date" {...field} />
              <FormMessage />
            </FormItem>
          )}
        />

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
          name="filter.roles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.studyForms')}</FormLabel>
              <FormControl>
                <MultipleSelector
                  defaultOptions={studyFormsData.map((studyForm) => ({ value: studyForm, label: studyForm }))}
                  placeholder={t('placeholders.studyForms')}
                  onChange={(options) => field.onChange(options.map((option) => option.value as string))}
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">{t('not-found')}</p>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="filter.groups"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.groups')}</FormLabel>
              <FormControl>
              <MultipleSelector
                  defaultOptions={groupsData.map((group) => ({ value: group.id.toString(), label: `${group.name} (${group.faculty})` }))}
                  placeholder={t('placeholders.groups')}
                  onChange={(options) => field.onChange(options.map((option) => option.value as string))}
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">{t('not-found')}</p>
                  }
                />
              
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="filter.studyForms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.roles')}</FormLabel>
              <FormControl>
                <MultipleSelector
                  defaultOptions={rolesData.map((role) => ({ value: role, label: role }))}
                  placeholder={t('placeholders.roles')}
                  onChange={(options) => field.onChange(options.map((option) => option.value as string))}
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">{t('not-found')}</p>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="filter.subdivisions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('fields.subdivisions')}</FormLabel>
              <FormControl>
                <MultipleSelector
                  defaultOptions={subdivisionsData.map((subdivision) => ({ value: subdivision.id.toString(), label: subdivision.name }))}
                  placeholder={t('placeholders.subdivisions')}
                  onChange={(options) => field.onChange(options.map((option) => parseInt(option.value as string)))}
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">{t('not-found')}</p>
                  }
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
                  defaultOptions={coursesData.map((course) => ({ value: course.toString(), label: course.toString() }))}
                  placeholder={t('placeholders.courses')}
                  onChange={(options) => field.onChange(options.map((option) => parseInt(option.value as string)))}
                  emptyIndicator={
                    <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">{t('not-found')}</p>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4">
          {t('buttons.submit')}
        </Button>
      </form>
    </Form>
  );
}
