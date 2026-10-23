import { getUserDetails } from '@/actions/auth.actions';
import { NextRequest } from 'next/server';
import { gotoLogin, gotoRoot, matchesUrl, redirectWithIntl } from './utils';
import { CODE_OF_HONOR_PATH } from './contants';
import { authorizationProxy } from './authorization.proxy';
import { intlProxy } from './intl.proxy';

export const codeOfHonorProxy = async (request: NextRequest) => {
  try {
    // TODO: Refactor to not use actions here
    const user = await getUserDetails();

    if (!user) {
      return gotoLogin(request);
    }

    const codeOfHonorSigned = !!user.codeOfHonorSignDate;
    const isCodeOfHonorPage = matchesUrl(request, CODE_OF_HONOR_PATH);

    if (!codeOfHonorSigned) {
      if (isCodeOfHonorPage) {
        return intlProxy(request);
      }

      return redirectWithIntl(request, CODE_OF_HONOR_PATH);
    }

    if (isCodeOfHonorPage) {
      return gotoRoot(request);
    }

    return authorizationProxy(request);
  } catch (error) {
    return authorizationProxy(request);
  }
};
