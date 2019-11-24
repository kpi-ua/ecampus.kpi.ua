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

export const Modules = {
  RNP: 'RNP',
  Statistic: 'Statistic',
  Messages: 'Messages',
  PersonalArea: 'PersonalArea',
  AttestationResult: 'AttestationResult',
  Information: 'Information'
};
