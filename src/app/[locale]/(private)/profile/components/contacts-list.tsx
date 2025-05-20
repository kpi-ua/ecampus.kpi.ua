import { Paragraph } from '@/components/typography';
import { EditableField } from '@/app/[locale]/(private)/profile/components/editable-field';
import React from 'react';
import { Contact } from '@/types/models/contact';

const PROHIBITED_CONTACT_TYPES = ['orcid id', 'research id', 'scopus id', 'google scholar', 'research gate'] as const;

interface Props {
  contacts: Contact[];
  onUpdateContact: (id: number, typeId: number, value: string) => void;
  onDeleteContact: (id: number) => void;
}

export default function ContactsList({ contacts, onUpdateContact, onDeleteContact }: Props) {
  return (
    <div className="flex w-full flex-col gap-4">
      {contacts.map((contact) => {
        const isReadonly = PROHIBITED_CONTACT_TYPES.find(
          (readOnlyContact) => readOnlyContact.toLowerCase() === contact.type.name.toLowerCase(),
        );
        return (
          <div className="group flex flex-col items-start gap-4 xl:flex-row xl:items-center" key={contact.id}>
            <Paragraph className="m-0 w-full min-w-[170px] max-w-[250px] font-semibold text-neutral-400 xl:max-w-[220px]">
              {contact.type.name}:
            </Paragraph>
            {isReadonly ? (
              <Paragraph className="m-0 min-w-[170px] break-all font-medium">{contact.value}</Paragraph>
            ) : (
              <EditableField
                value={contact.value}
                onSave={(newValue) => onUpdateContact(contact.id, contact.type.id, newValue)}
                onDelete={() => onDeleteContact(contact.id)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
