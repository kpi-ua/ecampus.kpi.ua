import { EMPTY_VALUE } from '@/lib/constants/empty-value';
import { Contact } from '@/types/models/colleague-contact';
import { ContactType } from '@/types/models/contact';

interface Props {
  contacts: Contact[];
  contactTypes: ContactType[];
}

export const StudentContacts = ({ contacts, contactTypes }: Props) => {
  if (!contacts.length) return EMPTY_VALUE;

  return (
    <div className="flex flex-col gap-1">
      {contacts.map(({ contactTypeId, value }, index) => (
        <div key={index}>
          {contactTypes.find((type) => type.id === contactTypeId)?.name ?? contactTypeId}: {value}
        </div>
      ))}
    </div>
  );
};
