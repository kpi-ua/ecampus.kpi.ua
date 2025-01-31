import { getAnnouncements } from '@/actions/announcement.actions';
import { AnnouncementsCarousel } from './announcements-carousel';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AnnouncementsCardProps {
  className?: string;
}

export const AnnouncementsCard = async ({ className }: AnnouncementsCardProps) => {
  const announcements = await getAnnouncements();

  return (
    <Card className={cn(className)}>
      <CardContent className="flex h-full gap-8 space-y-1.5 p-10">
        <AnnouncementsCarousel announcements={announcements} />
      </CardContent>
    </Card>
  );
};
