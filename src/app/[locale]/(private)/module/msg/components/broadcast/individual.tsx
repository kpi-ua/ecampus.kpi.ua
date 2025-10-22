'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@radix-ui/react-select';
import { Send } from 'lucide-react';
import { Subdivision } from '../compose';
import { Form, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
export function Individual({ facultyOptions }: { facultyOptions: Subdivision[] }) {
  const formSchema = z.object({
    facultyIds: z.array(z.number()),
    groupIds: z.array(z.number()),
    subject: z.string().min(1),
    content: z.string().min(1),
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facultyIds: [],
      groupIds: [],
      subject: '',
      content: '',
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Recipient Type Selection */}
        <div className="flex gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="recipientType"
              value="individual"
              checked={recipientType === 'individual'}
              onChange={() => setRecipientType('individual')}
              className="h-4 w-4"
            />
            <span>Співробітник</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="recipientType"
              value="broadcast"
              checked={recipientType === 'broadcast'}
              onChange={() => setRecipientType('broadcast')}
              className="h-4 w-4"
            />
            <span>Масове</span>
          </label>
        </div>
        <FormField
          control={form.control}
          name="facultyIds"
          render={({ field }) => (
            <FormItem>
              <Label>Підрозділ</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value.join(',')}>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  {facultyOptions.map((faculty) => (
                    <SelectItem key={faculty.id} value={faculty.id.toString()}>
                      {faculty.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {/* Dropdowns */}
        <FormField
          control={form.control}
          name="groupIds"
          render={({ field }) => (
            <FormItem>
              <Label>Навчальна група</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value.join(',')}>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="group1">Група 1</SelectItem>
                  <SelectItem value="group2">Група 2</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recipients"
          render={({ field }) => (
            <FormItem>
              <Label>ПІБ</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value.join(',')}>
                <SelectTrigger>
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="person1">Особа 1</SelectItem>
                  <SelectItem value="person2">Особа 2</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {/* <FormField
        control={form.control}
        name="recipients"
        render={({ field }) => (
          <FormItem>
            <Label>Одержувач(і)</Label>
            <Textarea {...field} placeholder="Одержувач(і)" maxLength={1000} />
          </FormItem>
        )}
      /> */}

        {/* Subject and Priority */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <Label>
                Тема повідомлення <span className="text-destructive">*</span>
              </Label>
              <Input {...field} placeholder="Тема повідомлення" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <Label>
                Текст повідомлення <span className="text-destructive">*</span>
              </Label>
              <Textarea {...field} placeholder="Текст повідомлення" maxLength={1000} />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="medium" icon={<Send className="h-4 w-4" />}>
            Відправити
          </Button>
        </div>
      </form>
    </Form>
  );
}
