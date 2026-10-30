export const ROOT_PATH = '/';
export const NOT_FOUND_PATH = '/not-found';
export const LOGIN_PATH = '/login';
// Public because it sits under LOGIN_PATH.
export const KPIID_FAILED_PATH = '/login/kpi-id-failed';
// The KPI ID redirect URI, registered in KPI ID for every origin the Campus is served from.
export const KPIID_CALLBACK_PATH = '/api/kpi-id/callback';
// Starts a KPI ID sign-in: the KPI ID initiate login URI, registered next to the redirect URI.
export const KPIID_LOGIN_PATH = '/api/kpi-id';
export const PUBLIC_PATHS = ['/login', '/password-reset', '/curator-search', '/suggestions', '/support', '/faq'];
export const MODULES_BASE_PATH = '/module';
export const CODE_OF_HONOR_PATH = '/accept-code-of-honor';
