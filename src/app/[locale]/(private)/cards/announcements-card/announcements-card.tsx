import { getAnnouncements } from '@/actions/announcement.actions';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { AnnouncementsCarousel } from './announcements-carousel';

interface AnnouncementsCardProps {
  className?: string;
}

export const AnnouncementsCard = async ({ className }: AnnouncementsCardProps) => {
  const announcements = await getAnnouncements({ excludeOutdated: true });

  return (
    <Card className={cn(className)}>
      <CardContent className="flex h-full gap-8 space-y-1.5 p-10">
        <AnnouncementsCarousel announcements={announcements} />
      </CardContent>
    </Card>
  );
};
