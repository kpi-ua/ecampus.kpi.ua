import { ZAMDEKAN_PATH } from '../constants';
import { ZamdekanQuery } from '../types';

const reportId = (id: number | undefined): number => {
  if (id === undefined || !Number.isSafeInteger(id) || id < 1) {
    throw new Error('Invalid report identifier');
  }
  return id;
};

export const getZamdekanReportPath = (query: ZamdekanQuery): string => {
  const monitoringPath = `${ZAMDEKAN_PATH}/monitoring`;
  const departmentPath = () => `${monitoringPath}/departments/${reportId(query.departmentId)}`;
  switch (query.view) {
    case 'groups':
      return ZAMDEKAN_PATH;
    case 'results':
      return `${ZAMDEKAN_PATH}/groups/${reportId(query.groupId)}/students/${reportId(query.studentId)}`;
    case 'monitoring-groups':
      return monitoringPath;
    case 'employees':
      return `${monitoringPath}/employees`;
    case 'department-groups':
      return departmentPath();
    case 'department-employees':
      return `${departmentPath()}/employees`;
    case 'group-load':
      return `${departmentPath()}/groups/${reportId(query.groupId)}`;
    case 'employee-load':
      return `${departmentPath()}/employees/${reportId(query.employeeId)}`;
    case 'sheets': {
      const parent =
        query.employeeId === undefined
          ? getZamdekanReportPath({ ...query, view: 'group-load' })
          : `${getZamdekanReportPath({ ...query, view: 'employee-load' })}/groups/${reportId(query.groupId)}`;
      return `${parent}/disciplines/${reportId(query.disciplineId)}`;
    }
    case 'sheet':
      return `${getZamdekanReportPath({ ...query, view: 'sheets' })}/sheets/${reportId(query.monitoringId)}`;
    case 'statistics':
      return `${departmentPath()}/statistics`;
    case 'outward-statistics':
      return `${departmentPath()}/statistics/other`;
    case 'summary':
      return `${monitoringPath}/summary${query.departmentId === undefined ? '' : `/${reportId(query.departmentId)}`}`;
  }
};
