import { ZAMDEKAN_PATH } from '../constants';
import { ZamdekanQuery } from '../types';

const reportId = (id: number | undefined): number => {
  if (id === undefined || !Number.isSafeInteger(id) || id < 1) throw new Error('Invalid report identifier');
  return id;
};

export const getZamdekanReportPath = (query: ZamdekanQuery): string => {
  const monitoringPath = `${ZAMDEKAN_PATH}/monitoring`;

  switch (query.view) {
    case 'groups':
      return ZAMDEKAN_PATH;
    case 'agreements':
      return `${ZAMDEKAN_PATH}/agreements${query.groupId === undefined ? '' : `/${reportId(query.groupId)}`}`;
    case 'results':
      return `${getZamdekanReportPath({ view: 'agreements', groupId: query.groupId })}/students/${reportId(query.studentId)}`;
    case 'monitoring-groups':
      return monitoringPath;
    case 'group-load':
      return `${monitoringPath}/groups/${reportId(query.groupId)}`;
    case 'employees':
      return `${monitoringPath}/employees`;
    case 'employee-load':
      return `${monitoringPath}/employees/${reportId(query.employeeId)}`;
    case 'activity':
      return `${getZamdekanReportPath({ view: 'employee-load', employeeId: query.employeeId })}/activity`;
    case 'sheets': {
      const groupPath = query.employeeId
        ? `${getZamdekanReportPath({ view: 'employee-load', employeeId: query.employeeId })}/groups/${reportId(query.groupId)}`
        : getZamdekanReportPath({ view: 'group-load', groupId: query.groupId });
      return `${groupPath}/disciplines/${reportId(query.disciplineId)}`;
    }
    case 'sheet':
      return `${getZamdekanReportPath({ ...query, view: 'sheets' })}/sheets/${reportId(query.monitoringId)}`;
    case 'statistics':
      return `${monitoringPath}/statistics${query.departmentId === undefined ? '' : `/${reportId(query.departmentId)}`}`;
    case 'statistics-other':
    case 'summary':
    case 'summary-other':
      return `${monitoringPath}/${query.view}${query.view === 'statistics-other' && query.cathedraId ? `/${reportId(query.cathedraId)}` : ''}`;
  }
};
