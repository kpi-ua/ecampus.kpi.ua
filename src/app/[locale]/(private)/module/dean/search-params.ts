import { createLoader, createParser, parseAsString, parseAsStringLiteral } from 'nuqs/server';

const parseAsId = createParser({
  parse(value) {
    const id = Number(value);
    return /^[1-9]\d*$/.test(value) && id <= 2147483647 ? id : null;
  },
  serialize: String,
});

export const departmentSearchParams = { departmentId: parseAsId };
export const surveySearchParams = { ...departmentSearchParams, page: parseAsId.withDefault(1) };
export const studentSearchParams = {
  ...surveySearchParams,
  course: createParser({
    parse(value) {
      const course = parseAsId.parse(value);
      return course !== null && course <= 12 ? course : null;
    },
    serialize: String,
  }),
  group: parseAsString,
};
export const employeeSearchParams = {
  ...departmentSearchParams,
  view: parseAsStringLiteral(['campus', 'personnel']).withDefault('campus'),
};

export const loadDepartmentSearchParams = createLoader(departmentSearchParams);
export const loadSurveySearchParams = createLoader(surveySearchParams);
export const loadStudentSearchParams = createLoader(studentSearchParams);
export const loadEmployeeSearchParams = createLoader(employeeSearchParams);
