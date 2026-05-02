import { AnnouncementFilter } from "@/types/models/announcement";

export const formatFilterCell = (value: string, noRestriction: string) => (
    <span className="block line-clamp-2 text-start text-sm" title={value || noRestriction}>
      {value || noRestriction}
    </span>
  );
  
  export const rolesText = (filter: AnnouncementFilter) =>
    filter.roles.length ? filter.roles.join(', ') : '';
  
  export const studyFormsText = (filter: AnnouncementFilter) =>
    filter.studyForms.length ? filter.studyForms.join(', ') : '';
  
  export const coursesText = (filter: AnnouncementFilter) =>
    filter.courses.length ? filter.courses.map((c) => String(c)).join(', ') : '';