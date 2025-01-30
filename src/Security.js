/**
 *
 * @param user
 * @param module
 * @returns {boolean}
 */
export const hasAccessToModule = (user, module) => {
  if (!user || !user.modules) {
    return false;
  }

  return user.modules.some(function (m) {
    return m === module;
  });
};

export const hasProfile = (user, profile) => {
  if (!user || !user.profiles) {
    return false;
  }

  return user.profiles.some(function (p) {
    return p.profile === profile;
  });

  // return true;
};

export const Modules = {
  PersonalArea: 'PersonalArea',
  Information: 'Information',
  EmploymentSystem: 'EmploymentSystem'
};

export const Profiles = {
  Unknown: 'Unknown',
  DepartmentHead: 'DepartmentHead',
  Methodist: 'Methodist',
  Lecturer: 'Lecturer',
  StudyGroup: 'StudyGroup',
  Student: 'Student',
  GroupHeadman: 'GroupHeadman',
  GroupTradeUnion: 'GroupTradeUnion',
  GroupCurator: 'GroupCurator',
  Analyst: 'Analyst',
  Tester: 'Tester',
  Moderator: 'Moderator',
};
