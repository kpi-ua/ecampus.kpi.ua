import { DeputyDeanView, DEPUTY_DEAN_PATH } from '../constants';
import { DeputyDeanQuery } from '../types';

export const getDeputyDeanReportPath = (query: DeputyDeanQuery): string => {
  const monitoringPath = `${DEPUTY_DEAN_PATH}/monitoring`;
  const departmentPath = (departmentId: number) => `${monitoringPath}/departments/${departmentId}`;
  switch (query.view) {
    case DeputyDeanView.Groups:
      return DEPUTY_DEAN_PATH;
    case DeputyDeanView.Results:
      return `${DEPUTY_DEAN_PATH}/groups/${query.groupId}/students/${query.studentId}`;
    case DeputyDeanView.MonitoringGroups:
      return monitoringPath;
    case DeputyDeanView.Employees:
      return `${monitoringPath}/employees`;
    case DeputyDeanView.DepartmentGroups:
      return departmentPath(query.departmentId);
    case DeputyDeanView.DepartmentEmployees:
      return `${departmentPath(query.departmentId)}/employees`;
    case DeputyDeanView.GroupLoad:
      return `${departmentPath(query.departmentId)}/groups/${query.groupId}`;
    case DeputyDeanView.EmployeeLoad:
      return `${departmentPath(query.departmentId)}/employees/${query.employeeId}`;
    case DeputyDeanView.Sheets: {
      const parent =
        query.employeeId === undefined
          ? getDeputyDeanReportPath({
              view: DeputyDeanView.GroupLoad,
              departmentId: query.departmentId,
              groupId: query.groupId,
            })
          : `${getDeputyDeanReportPath({ view: DeputyDeanView.EmployeeLoad, departmentId: query.departmentId, employeeId: query.employeeId })}/groups/${query.groupId}`;
      return `${parent}/disciplines/${query.disciplineId}`;
    }
    case DeputyDeanView.Sheet:
      return `${getDeputyDeanReportPath({ ...query, view: DeputyDeanView.Sheets })}/sheets/${query.monitoringId}`;
    case DeputyDeanView.Statistics:
      return `${departmentPath(query.departmentId)}/statistics`;
    case DeputyDeanView.OutwardStatistics:
      return `${departmentPath(query.departmentId)}/statistics/other`;
    case DeputyDeanView.Summary:
      return `${monitoringPath}/summary${query.departmentId === undefined ? '' : `/${query.departmentId}`}`;
  }
};
