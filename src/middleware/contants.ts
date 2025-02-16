import { ProfileArea } from '@/types/enums/profile-area';

export const ROOT_PATH = '/';
export const LOGIN_PATH = '/login';
export const PUBLIC_PATHS = ['/login', '/password-reset', '/curator-search', '/complaints', '/support', '/faq'];
export const MODULES_BASE_PATHS = [`/${ProfileArea.Student}/module`, `/${ProfileArea.Employee}/module`];
export const CODE_OF_HONOR_PATH = '/accept-code-of-honor';
