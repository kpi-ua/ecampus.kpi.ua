import type { AdminAnnouncementsLanguage } from './types';

export const LIST_PATH = '/module/announcementseditor';

export const ANNOUNCEMENT_FILTER_LANGUAGES = ['all', 'uk', 'en'] as const satisfies readonly AdminAnnouncementsLanguage[];
