import { ContactTypeId } from '@/types/enums/contact-type';

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
