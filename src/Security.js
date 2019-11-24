/**
 * Check that user has profile
 * @param user
 * @param profile
 * @returns {boolean}
 */
export const userHasProfile = (user, profile) => {

  if (!user || !user.userProfiles) {
    return false;
  }

  return user.userProfiles.some(function (p) {
    return  !!p &&  p.profile === profile;
  });

};
