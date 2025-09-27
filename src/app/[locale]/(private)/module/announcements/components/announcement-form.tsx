'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  MultiSelector,
  MultiSelectorContent,
  MultiSelectorInput,
  MultiSelectorItem,
  MultiSelectorList,
  MultiSelectorTrigger,
} from '@/components/ui/multi-select';
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

export function AnnouncementForm({ rolesData, studyFormsData, groupsData, subdivisionsData, coursesData }: Props) {
  const { errorToast } = useServerErrorToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createAnnouncement(values);
    } catch (error) {
      errorToast();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto">
        <FormField
          control={form.control}
          name="announcement.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" type="text" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Description" rows={4} {...field} />
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
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input placeholder="Image URL" type="text" {...field} />
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
              <FormLabel>Link Title</FormLabel>
              <FormControl>
                <Input placeholder="Link Title" type="text" {...field} />
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
              <FormLabel>Link URL</FormLabel>
              <FormControl>
                <Input placeholder="Link URL" type="text" {...field} />
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
              <FormLabel>Start Date</FormLabel>
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
              <FormLabel>End Date</FormLabel>
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
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="uk">Ukrainian</SelectItem>
                  <SelectItem value="en">English</SelectItem>
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
              <FormLabel>Study Forms</FormLabel>
              <FormControl>
                <MultiSelector
                  values={field.value?.map((studyForm) => studyForm.toString()) || []}
                  onValuesChange={field.onChange}
                  loop
                  options={studyFormsData.map((studyForm) => ({ value: studyForm, label: studyForm }))}
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select study forms" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {studyFormsData.map((studyForm) => (
                        <MultiSelectorItem key={studyForm} value={studyForm}>
                          {studyForm}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
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
              <FormLabel>Groups</FormLabel>
              <FormControl>
                <MultiSelector
                  values={field.value?.map((group) => group.toString()) || []}
                  onValuesChange={field.onChange}
                  loop
                  options={groupsData.map((group) => ({
                    value: group.id.toString(),
                    label: `${group.name} (${group.faculty})`,
                  }))}
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select groups" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {groupsData.map((group) => (
                        <MultiSelectorItem key={group.id} value={group.id.toString()}>
                          {`${group.name} (${group.faculty})`}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
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
              <FormLabel>Roles</FormLabel>
              <FormControl>
                <MultiSelector
                  values={field.value?.map((role) => role.toString()) || []}
                  onValuesChange={field.onChange}
                  loop
                  options={rolesData.map((role) => ({ value: role, label: role }))}
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select roles" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {rolesData.map((role) => (
                        <MultiSelectorItem key={role} value={role}>
                          {role}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
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
              <FormLabel>Subdivisions</FormLabel>
              <FormControl>
                <MultiSelector
                  values={field.value?.map((subdivision) => subdivision.toString()) || []}
                  onValuesChange={(values) => field.onChange(values.map((v) => parseInt(v, 10)))}
                  loop
                  options={subdivisionsData.map((subdivision) => ({
                    value: subdivision.id.toString(),
                    label: subdivision.name,
                  }))}
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select subdivisions" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {subdivisionsData.map((subdivision) => (
                        <MultiSelectorItem key={subdivision.id} value={subdivision.id.toString()}>
                          {subdivision.name}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
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
              <FormLabel>Courses</FormLabel>
              <FormControl>
                <MultiSelector
                  values={field.value?.map((course) => course.toString()) || []}
                  onValuesChange={(values) => field.onChange(values.map((v) => parseInt(v, 10)))}
                  loop
                  options={coursesData.map((course) => ({
                    value: course.toString(),
                    label: course.toString(),
                  }))}
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select courses" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      {coursesData.map((course) => (
                        <MultiSelectorItem key={course} value={course.toString()}>
                          {course}
                        </MultiSelectorItem>
                      ))}
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}
