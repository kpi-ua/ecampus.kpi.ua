import { createLoader, createParser } from 'nuqs/server';

const positiveId = createParser({
  parse(value) {
    const id = Number(value);
    return /^[1-9]\d*$/.test(value) && id <= 2147483647 ? id : null;
  },
  serialize: String,
});

export const deansOfficeSearchParams = {
  facultyId: positiveId,
  departmentId: positiveId,
  yearId: positiveId,
  course: positiveId,
  groupId: positiveId,
  programId: positiveId,
  semester: positiveId,
  periodTypeId: positiveId,
};

export const loadDeansOfficeSearchParams = createLoader(deansOfficeSearchParams);
