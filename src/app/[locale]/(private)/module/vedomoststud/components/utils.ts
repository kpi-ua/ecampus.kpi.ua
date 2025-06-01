import { Status } from '@/types/enums/session/status';

const STATUS_STYLES = {
  success: 'border-green-300 bg-green-100 text-green-600',
  error: 'border-red-300 bg-red-100 text-red-600',
  default: 'border-gray-300 bg-gray-100 text-gray-600',
} as const;

const STATUS_STYLE_MAP: Partial<Record<Status, keyof typeof STATUS_STYLES>> = {
  [Status.Passed]: 'success',
  [Status.Expelled]: 'error',
  [Status.Rejected]: 'error',
  [Status.Absent]: 'error',
} as const;

export function getStatusStyle(status: Status): string {
  return STATUS_STYLES[STATUS_STYLE_MAP[status] ?? 'default'];
}
