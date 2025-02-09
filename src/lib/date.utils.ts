import dayjs from 'dayjs';

export const isOutdated = (endDate?: Date) => dayjs(endDate).isBefore(dayjs());
