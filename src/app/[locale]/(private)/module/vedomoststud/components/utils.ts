import { Status } from '@/types/enums/session/status';

const STATUS_STYLES = {
  success: 'border-green-300 bg-green-100 text-green-600',
  error: 'border-red-300 bg-red-100 text-red-600',
  default: 'border-gray-300 bg-gray-100 text-gray-600',
} as const;

export function getStatusStyle(status: Status) {
  switch (status) {
    case Status.Passed:
    case Status.Good:
    case Status.VeryGood:
    case Status.Sufficient:
    case Status.Excellent:
      return STATUS_STYLES.success;
    case Status.Expelled:
    case Status.Rejected:
    case Status.Absent:
      return STATUS_STYLES.error;
    default:
      return STATUS_STYLES.default;
  }
}
