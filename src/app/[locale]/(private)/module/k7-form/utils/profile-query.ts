import { createParser, parseAsInteger, parseAsString } from 'nuqs';

import { K7FormLecturerProfile } from '@/types/models/k7-form';

export type K7FormLecturerProfileQuery = Pick<K7FormLecturerProfile, 'employeeId' | 'departmentId' | 'position'> & {
  userAccountId?: number;
};

export const parseAsProfileId = createParser<K7FormLecturerProfileQuery | null>({
  parse(query) {
    const [queryUserAccountId = '', queryEmployeeId = '', queryDepartmentId = '', ...queryPosition] = query.split(':');
    const userAccountId = parseAsInteger.parse(queryUserAccountId);
    const employeeId = parseAsInteger.parse(queryEmployeeId);
    const departmentId = parseAsInteger.parse(queryDepartmentId);
    const position = parseAsString.parse(queryPosition.join(':'));

    if (employeeId === null || departmentId === null || !position) {
      return null;
    }

    return {
      ...(userAccountId === null ? {} : { userAccountId }),
      employeeId,
      departmentId,
      position,
    };
  },
  serialize(value) {
    if (!value) return '';

    return [value.userAccountId ?? '', value.employeeId, value.departmentId, value.position].join(':');
  },
});

export const compareProfile = (profileA: K7FormLecturerProfileQuery | null) => (profileB: K7FormLecturerProfileQuery) =>
  profileA?.userAccountId === profileB.userAccountId &&
  profileA?.employeeId === profileB.employeeId &&
  profileA?.departmentId === profileB.departmentId &&
  profileA?.position === profileB.position;
