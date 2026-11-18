import { DeputyDeanView, DEPUTY_DEAN_PATH } from '../constants';
import { DeputyDeanQuery } from '../types';

const reportId = (id: number | undefined): number => {
  if (id === undefined || !Number.isSafeInteger(id) || id < 1) {
    throw new Error('Invalid report identifier');
  }
  return id;
};

export const getDeputyDeanReportPath = (query: DeputyDeanQuery): string => {
  const monitoringPath = `${DEPUTY_DEAN_PATH}/monitoring`;
  const departmentPath = () => `${monitoringPath}/departments/${reportId(query.departmentId)}`;
  switch (query.view) {
    case DeputyDeanView.Groups:
      return DEPUTY_DEAN_PATH;
    case DeputyDeanView.Results:
      return `${DEPUTY_DEAN_PATH}/groups/${reportId(query.groupId)}/students/${reportId(query.studentId)}`;
    case DeputyDeanView.MonitoringGroups:
      return monitoringPath;
    case DeputyDeanView.Employees:
      return `${monitoringPath}/employees`;
    case DeputyDeanView.DepartmentGroups:
      return departmentPath();
    case DeputyDeanView.DepartmentEmployees:
      return `${departmentPath()}/employees`;
    case DeputyDeanView.GroupLoad:
      return `${departmentPath()}/groups/${reportId(query.groupId)}`;
    case DeputyDeanView.EmployeeLoad:
      return `${departmentPath()}/employees/${reportId(query.employeeId)}`;
    case DeputyDeanView.Sheets: {
      const parent =
        query.employeeId === undefined
          ? getDeputyDeanReportPath({ ...query, view: DeputyDeanView.GroupLoad })
          : `${getDeputyDeanReportPath({ ...query, view: DeputyDeanView.EmployeeLoad })}/groups/${reportId(query.groupId)}`;
      return `${parent}/disciplines/${reportId(query.disciplineId)}`;
    }
    case DeputyDeanView.Sheet:
      return `${getDeputyDeanReportPath({ ...query, view: DeputyDeanView.Sheets })}/sheets/${reportId(query.monitoringId)}`;
    case DeputyDeanView.Statistics:
      return `${departmentPath()}/statistics`;
    case DeputyDeanView.OutwardStatistics:
      return `${departmentPath()}/statistics/other`;
    case DeputyDeanView.Summary:
      return `${monitoringPath}/summary${query.departmentId === undefined ? '' : `/${reportId(query.departmentId)}`}`;
  }
};
