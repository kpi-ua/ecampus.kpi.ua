import { Paragraph } from '@/components/typography';
import { EditableField } from '@/app/[locale]/(private)/profile/components/editable-field';
import { Contact } from '@/types/models/contact';
import { useTranslations } from 'next-intl';

const PROHIBITED_CONTACT_TYPES = ['orcid id', 'research id', 'scopus id', 'google scholar', 'research gate'] as const;

interface Props {
  corporateEmail?: string | null;
  contacts: Contact[];
  onUpdateContact: (id: number, typeId: number, value: string) => void;
  onDeleteContact: (id: number) => void;
}

export default function ContactsList({ corporateEmail, contacts, onUpdateContact, onDeleteContact }: Props) {
  const t = useTranslations('private.profile');

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col items-start gap-4 xl:flex-row xl:items-center">
        <Paragraph className="m-0 w-full max-w-[250px] min-w-[170px] font-semibold text-neutral-400 xl:max-w-[220px]">
          {t('contact.corporate-email')}:
        </Paragraph>
        <Paragraph className="m-0 min-w-[170px] font-medium break-all">
          {corporateEmail?.trim() || t('placeholder.not-specified')}
        </Paragraph>
      </div>
      {contacts.map((contact) => {
        const isReadonly = PROHIBITED_CONTACT_TYPES.find(
          (readOnlyContact) => readOnlyContact.toLowerCase() === contact.type.name.toLowerCase(),
        );
        return (
          <div className="group flex flex-col items-start gap-4 xl:flex-row xl:items-center" key={contact.id}>
            <Paragraph className="m-0 w-full max-w-[250px] min-w-[170px] font-semibold text-neutral-400 xl:max-w-[220px]">
              {contact.type.name}:
            </Paragraph>
            {isReadonly ? (
              <Paragraph className="m-0 min-w-[170px] font-medium break-all">{contact.value}</Paragraph>
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
