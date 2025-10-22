import { Status } from '@/types/enums/session/status';
import { badgeVariants } from '@/components/ui/badge';

export function getStatusStyle(status: Status) {
  switch (status) {
    case Status.Passed:
    case Status.Good:
    case Status.VeryGood:
    case Status.Sufficient:
    case Status.Excellent:
      return badgeVariants({ variant: 'success' });
    case Status.Expelled:
    case Status.Rejected:
    case Status.Absent:
      return badgeVariants({ variant: 'error' });
    default:
      return badgeVariants({ variant: 'default' });
  }
}
