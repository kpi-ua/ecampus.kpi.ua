import { ZamdekanView, ZAMDEKAN_PATH } from '../constants';
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
    case ZamdekanView.Groups:
      return ZAMDEKAN_PATH;
    case ZamdekanView.Results:
      return `${ZAMDEKAN_PATH}/groups/${reportId(query.groupId)}/students/${reportId(query.studentId)}`;
    case ZamdekanView.MonitoringGroups:
      return monitoringPath;
    case ZamdekanView.Employees:
      return `${monitoringPath}/employees`;
    case ZamdekanView.DepartmentGroups:
      return departmentPath();
    case ZamdekanView.DepartmentEmployees:
      return `${departmentPath()}/employees`;
    case ZamdekanView.GroupLoad:
      return `${departmentPath()}/groups/${reportId(query.groupId)}`;
    case ZamdekanView.EmployeeLoad:
      return `${departmentPath()}/employees/${reportId(query.employeeId)}`;
    case ZamdekanView.Sheets: {
      const parent =
        query.employeeId === undefined
          ? getZamdekanReportPath({ ...query, view: ZamdekanView.GroupLoad })
          : `${getZamdekanReportPath({ ...query, view: ZamdekanView.EmployeeLoad })}/groups/${reportId(query.groupId)}`;
      return `${parent}/disciplines/${reportId(query.disciplineId)}`;
    }
    case ZamdekanView.Sheet:
      return `${getZamdekanReportPath({ ...query, view: ZamdekanView.Sheets })}/sheets/${reportId(query.monitoringId)}`;
    case ZamdekanView.Statistics:
      return `${departmentPath()}/statistics`;
    case ZamdekanView.OutwardStatistics:
      return `${departmentPath()}/statistics/other`;
    case ZamdekanView.Summary:
      return `${monitoringPath}/summary${query.departmentId === undefined ? '' : `/${reportId(query.departmentId)}`}`;
  }
};
