import { getUserDetails } from '@/actions/auth.actions';
import { NextRequest } from 'next/server';
import { gotoLogin, gotoRoot, matchesUrl, redirectWithIntl } from './utils';
import { CODE_OF_HONOR_PATH } from './contants';
import { authorizationMiddleware } from './authorization.middleware';
import { intlMiddleware } from './intl.middleware';

export const codeOfHonorMiddleware = async (request: NextRequest) => {
  try {
    // TODO: Refactor to not use actions here
    const user = await getUserDetails();

    if (!user) {
      return gotoLogin(request);
    }

    const isStudent = !!user.studentProfile;
    const codeOfHonorSigned = (isStudent && !!user.codeOfHonorSignDate) || !isStudent;
    const isCodeOfHonorPage = matchesUrl(request, CODE_OF_HONOR_PATH);

    if (!codeOfHonorSigned) {
      if (isCodeOfHonorPage) {
        return intlMiddleware(request);
      }

      return redirectWithIntl(request, CODE_OF_HONOR_PATH);
    }

    if (isCodeOfHonorPage) {
      return gotoRoot(request);
    }

    return authorizationMiddleware(request);
  } catch (error) {
    return authorizationMiddleware(request);
  }
};
