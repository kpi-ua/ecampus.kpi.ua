export enum UserCategories {
  Student = 'Student',
  Lecturer = 'Lecturer',
}

export enum EmploymentType {
  Unknown = 'Unknown',
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  PartTimeInternal = 'PartTimeInternal',
  PartTimeExternal = 'PartTimeExternal',
}

export const USER_CATEGORIES = {
  [UserCategories.Student]: 'student',
  [UserCategories.Lecturer]: 'spw', // SPW stands for scientific and pedagogical worker
};

export const EMPLOYMENT_TYPE = {
  [EmploymentType.Unknown]: 'невідомо',
  [EmploymentType.FullTime]: 'основне',
  [EmploymentType.PartTime]: 'сумісник',
  [EmploymentType.PartTimeInternal]: 'внутрішній сумісник',
  [EmploymentType.PartTimeExternal]: 'зовнішній сумісник',
};
