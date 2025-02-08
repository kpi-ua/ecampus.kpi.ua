import { Announcement } from '@/types/announcement';
import { Heading4 } from '@/components/typography/headers';
import { Paragraph } from '@/components/typography/paragraph';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Show } from '@/components/utils/show';
import { isOutdated } from '@/lib/date.utils';

interface NoticeProps {
  announcement: Announcement;
}
export function Notice({ announcement }: NoticeProps) {
  const formattedDateStart = dayjs(announcement.start).format('DD.MM.YYYY');
  const formattedDateEnd = dayjs(announcement.end).format('DD.MM.YYYY');
  const isAnnouncementOutdated = isOutdated(announcement.end);

  return (
    <div className={`flex flex-col gap-6 ${isAnnouncementOutdated ? 'opacity-50' : 'opacity-100'}`}>
      <div className="flex flex-col gap-3 text-neutral-900">
        <Heading4>{announcement.title}</Heading4>
        <Paragraph className="m-0 line-clamp-3 font-medium">{announcement.description}</Paragraph>
      </div>
      <Show when={!isAnnouncementOutdated}>
        <Button className="w-fit" variant="secondary" asChild>
          <Link href={announcement.link || ''} target="_blank">
            {announcement.linkTitle}
          </Link>
        </Button>
      </Show>
      <div className="flex justify-between font-semibold text-neutral-600">
        <span>
          {formattedDateStart} - {formattedDateEnd ?? '...'}
        </span>
      </div>
    </div>
  );
}
