import { Paragraph } from '@/components/typography';
import { ContactLink } from './contact-link';

interface ProcessedContact {
  typeId: number;
  typeName: string;
  value?: string;
}

interface ContactListProps {
  contacts: ProcessedContact[];
}

export function ContactList({ contacts }: ContactListProps) {
  return (
    <div className="flex flex-col gap-2">
      {contacts.map((contact, index) => (
        <div key={`${contact.typeId}-${index}`} className="flex items-baseline gap-2">
          <Paragraph className="m-0 text-xs font-semibold text-neutral-600 whitespace-nowrap">
            {contact.typeName}:
          </Paragraph>
          <Paragraph className="m-0 text-xs">
            {contact.value ? <ContactLink typeId={contact.typeId} value={contact.value} /> : '-'}
          </Paragraph>
        </div>
      ))}
    </div>
  );
}
