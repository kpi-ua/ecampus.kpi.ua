import { ContactTypeId } from '@/types/enums/contact-type';
import { EmploymentType } from '@/types/enums/employment-type';
import { UserCategory } from '@/types/enums/user-category';

export const UKRAINIAN_ALPHABET = 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ';

export const USER_PROFILE_CACHE_TAG = 'user-profile';

/**
 * All phone-related contact type IDs
 */
export const PHONE_TYPE_IDS = [
  ContactTypeId.PhoneHome,
  ContactTypeId.PhoneMobile,
  ContactTypeId.PhoneWork,
  ContactTypeId.PhoneFax,
] as const;

/**
 * All web-related contact type IDs
 */
export const WEB_TYPE_IDS = [ContactTypeId.WebDeprecated, ContactTypeId.Web] as const;

/**
 * Academic identifier contact type IDs
 */
export const ACADEMIC_IDENTIFIER_IDS = [
  ContactTypeId.OrcidId,
  ContactTypeId.ScopusId,
  ContactTypeId.ResearchId,
  ContactTypeId.GoogleScholar,
  ContactTypeId.ResearchGate,
] as const;

export const TOKEN_COOKIE_NAME = 'ecampus-token';
export const SID_COOKIE_NAME = 'SID';
// Holds the KPI ID login state between starting a login and its callback.
export const KPIID_STATE_COOKIE_NAME = 'kpi-id-state';
// KPI ID tickets live 5 minutes. A login page left open longer than this is sent back to the login page, which
// issues a fresh state; SSO brings the user straight back after the next click.
export const KPIID_STATE_MAX_AGE_SECONDS = 15 * 60;

export const EMPLOYMENT_TYPE = {
  [EmploymentType.Unknown]: 'невідомо',
  [EmploymentType.FullTime]: 'основне',
  [EmploymentType.PartTime]: 'сумісник',
  [EmploymentType.PartTimeInternal]: 'внутрішній сумісник',
  [EmploymentType.PartTimeExternal]: 'зовнішній сумісник',
};

export const EMPTY_VALUE = '—';

export const PAGE_SIZE_DEFAULT = 20;
export const PAGE_SIZE_SMALL = 5;

export const PASSWORD_MASK = '••••••••';

export const USER_CATEGORIES = {
  [UserCategory.Student]: 'student',
  [UserCategory.Lecturer]: 'spw', // SPW stands for scientific and pedagogical worker
};
