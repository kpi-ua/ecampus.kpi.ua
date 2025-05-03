import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

export const getUserAgentInfo = async () => {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent');

  if (!userAgent) {
    return undefined;
  }

  return UAParser(userAgent);
};

export const isIOS = async () => {
  const userAgent = await getUserAgentInfo();
  return userAgent?.os.is('iOS') ?? false;
};
