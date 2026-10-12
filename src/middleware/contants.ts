export const ROOT_PATH = '/';
export const NOT_FOUND_PATH = '/not-found';
export const LOGIN_PATH = '/login';
// Public because it sits under LOGIN_PATH.
export const KPIID_FAILED_PATH = '/login/kpi-id-failed';
// Route handlers are outside the middleware matcher, so they need no PUBLIC_PATHS entry.
export const KPIID_LOGIN_PATH = '/api/kpi-id/login';
export const PUBLIC_PATHS = [
  '/login',
  '/password-reset',
  '/curator-search',
  '/suggestions',
  '/support',
  '/faq',
];
export const MODULES_BASE_PATH = '/module';
export const CODE_OF_HONOR_PATH = '/accept-code-of-honor';
