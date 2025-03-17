import { headers } from 'next/headers';
import { UAParser } from 'ua-parser-js';

export const getUserAgentInfo = () => {
  const headersList = headers();
  const userAgent = headersList.get('user-agent');

  if (!userAgent) {
    return undefined;
  }

  return UAParser(userAgent);
};

export const isIOSSafari = (uaInfo: UAParser.IResult) => uaInfo.device.is('mobile') && uaInfo.os.is('iOS');
