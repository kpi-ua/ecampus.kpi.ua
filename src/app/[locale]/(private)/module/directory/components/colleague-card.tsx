import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { ColleagueContact, ContactType } from '@/types/models/colleague-contact';
import { Paragraph } from '@/components/typography';
import { ContactLink } from './contact-link';
import { ACADEMIC_IDENTIFIER_IDS } from '@/lib/constants/contact-types';
import { Link } from '@/i18n/routing';

interface ColleagueCardProps {
  colleague: ColleagueContact;
  contactTypes: ContactType[];
}

export function ColleagueCard({ colleague, contactTypes }: ColleagueCardProps) {
  // Process all contacts without grouping
  const processedContacts = colleague.contacts
    .map((contact) => {
      const contactType = contactTypes.find((type) => type.id === contact.contactTypeId);
      if (!contactType) return null;

      // Skip empty values
      if (!contact.value || contact.value.trim() === '') return null;

      return {
        typeId: contact.contactTypeId,
        typeName: contactType.name,
        value: contact.value,
      };
    })
    .filter((contact): contact is NonNullable<typeof contact> => contact !== null);

  // Add academic identifiers with '-' if they don't exist
  const existingAcademicIds = new Set(processedContacts.map((c) => c.typeId));
  const missingAcademicContacts = ACADEMIC_IDENTIFIER_IDS.filter((id) => !existingAcademicIds.has(id))
    .map((id) => {
      const contactType = contactTypes.find((type) => type.id === id);
      if (!contactType) return null;
      return {
        typeId: id,
        typeName: contactType.name,
        value: '-',
      };
    })
    .filter((contact): contact is NonNullable<typeof contact> => contact !== null);

  const allContacts = [...processedContacts, ...missingAcademicContacts];

  // Separate academic identifiers and other contacts
  const academicContacts = allContacts.filter((contact) =>
    ACADEMIC_IDENTIFIER_IDS.includes(contact.typeId as (typeof ACADEMIC_IDENTIFIER_IDS)[number]),
  );

  const otherContacts = allContacts.filter(
    (contact) => !ACADEMIC_IDENTIFIER_IDS.includes(contact.typeId as (typeof ACADEMIC_IDENTIFIER_IDS)[number]),
  );

  const hasIntellectProfile = colleague.intellectProfileEnabled && colleague.intellectProfile;

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          <div className="flex flex-col gap-1 md:w-[300px]">
            {hasIntellectProfile ? (
              <Link
                href={colleague.intellectProfile!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base leading-tight"
              >
                {colleague.fullName}
              </Link>
            ) : (
              <CardTitle className="text-base font-semibold leading-tight">{colleague.fullName}</CardTitle>
            )}
            <div className="flex flex-col gap-1.5">
              {colleague.positions.map((position, index) => (
                <div key={index}>
                  {index > 0 && <div className="border-t border-neutral-200 my-1" />}
                  <Paragraph className="m-0 text-xs text-neutral-500">{position.name}</Paragraph>
                  <Paragraph className="m-0 text-xs text-neutral-400">{position.subdivision.name}</Paragraph>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            {/* Left column: Academic identifiers */}
            <div className="flex flex-col gap-2">
              {academicContacts.map((contact, index) => (
                <div key={`${contact.typeId}-${index}`} className="flex items-baseline gap-2">
                  <Paragraph className="m-0 text-xs font-semibold text-neutral-600 whitespace-nowrap">
                    {contact.typeName}:
                  </Paragraph>
                  <Paragraph className="m-0 text-xs">
                    {contact.value === '-' ? '-' : <ContactLink typeId={contact.typeId} value={contact.value} />}
                  </Paragraph>
                </div>
              ))}
            </div>
            {/* Right column: Other contacts */}
            <div className="flex flex-col gap-2">
              {otherContacts.map((contact, index) => (
                <div key={`${contact.typeId}-${index}`} className="flex items-baseline gap-2">
                  <Paragraph className="m-0 text-xs font-semibold text-neutral-600 whitespace-nowrap">
                    {contact.typeName}:
                  </Paragraph>
                  <Paragraph className="m-0 text-xs">
                    {contact.value === '-' ? '-' : <ContactLink typeId={contact.typeId} value={contact.value} />}
                  </Paragraph>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
