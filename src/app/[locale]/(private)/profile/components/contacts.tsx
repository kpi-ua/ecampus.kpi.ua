'use client';

import { Heading6 } from '@/components/typography/headers';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Contact, ContactType } from '@/types/models/contact';
import { createContact, deleteContact, updateContact } from '@/actions/profile.actions';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from 'next-intl';
import React from 'react';
import ContactsList from '@/app/[locale]/(private)/profile/components/contacts-list';

interface Props {
  contacts: Contact[];
  contactTypes: ContactType[];
}

export function Contacts({ contacts, contactTypes }: Props) {
  const t = useTranslations('private.profile');

  const FormSchema = z.object({
    contactValue: z.string().trim().min(1),
    typeId: z.string().min(1),
  });

  type FormData = z.infer<typeof FormSchema>;

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      contactValue: '',
      typeId: '',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    await createContact(parseInt(data.typeId), data.contactValue);
    form.reset();
  };

  const handleDeleteContact = async (id: number) => {
    await deleteContact(id);
    form.reset();
  };

  const handleUpdateContact = async (id: number, typeId: number, value: string) => {
    await updateContact(id, typeId, value);
  };

  return (
    <div className="flex flex-col">
      <div className="flex w-full flex-col gap-3">
        <Heading6>{t('contact.title')}</Heading6>
        <Separator />
        <ContactsList contacts={contacts} onDeleteContact={handleDeleteContact} onUpdateContact={handleUpdateContact} />
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Heading6>{t('contact.add-contact')}</Heading6>
        <Separator />
        <Form {...form}>
          <form className="flex flex-col" onSubmit={form.handleSubmit(handleFormSubmit)}>
            <div className="flex flex-col gap-5 md:flex-row">
              <FormField
                control={form.control}
                name="typeId"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2">
                    <FormLabel className="text-base" htmlFor="typeId">
                      {t('contact.contact-type')}
                    </FormLabel>
                    <Select onValueChange={field.onChange} {...field}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('contact.choose-contact-type')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          {contactTypes.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactValue"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col gap-2">
                    <FormLabel className="text-base" htmlFor="contactValue">
                      {t('contact.title')}
                    </FormLabel>
                    <Input {...field} value={field.value || ''} />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              className="mt-3 ml-auto w-fit"
              variant="secondary"
              disabled={!form.formState.isValid}
              loading={form.formState.isSubmitting}
            >
              {t('button.add-new')}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
