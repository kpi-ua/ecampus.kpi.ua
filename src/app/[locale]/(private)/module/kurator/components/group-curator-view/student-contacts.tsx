import { Show } from '@/components/utils/show';

interface Props {
  email: string | null;
  contacts: string[];
}

const isPhoneNumber = (value: string) => /^[+\d][\d\s()-]{6,}$/.test(value);

export const StudentContacts = ({ email, contacts }: Props) => {
  const values = Array.from(
    new Map(
      [email, ...contacts]
        .filter((value): value is string => Boolean(value?.trim()))
        .map((value) => [value.trim().toLocaleLowerCase(), value.trim()]),
    ).values(),
  );

  if (!values.length) return '—';

  return (
    <div className="flex flex-col gap-1">
      {values.map((value) => (
        <div key={value}>
          <Show when={isPhoneNumber(value) || value.includes('@')} fallback={value}>
            <a
              className="text-basic-blue hover:underline"
              href={isPhoneNumber(value) ? `tel:${value.replace(/[^+\d]/g, '')}` : `mailto:${value}`}
            >
              {value}
            </a>
          </Show>
        </div>
      ))}
    </div>
  );
};
