import { USER_CATEGORIES } from '@/lib/constants/common';
import { UserCategory } from '@/types/enums/user-category';

// TODO(KBX-1526): drop the alias once kpi-ua/api.campus.kpi.ua#979 is deployed; the API then sends "AcademicStaff".
const LEGACY_USER_CATEGORY_NAMES: Record<string, UserCategory> = {
  Lecturer: UserCategory.AcademicStaff,
};

const USER_CATEGORY_VALUES = new Set<string>(Object.values(UserCategory));

/** Resolves an API role name, legacy spellings included, to a category; `undefined` for an unknown role. */
export const toUserCategory = (value: string): UserCategory | undefined => {
  if (USER_CATEGORY_VALUES.has(value)) {
    return value as UserCategory;
  }

  return LEGACY_USER_CATEGORY_NAMES[value];
};

/**
 * Normalises the `roles` of an API profile once, at the boundary, so consumers only ever
 * see `UserCategory` values. Unknown roles are dropped rather than shown as a raw key.
 */
export const normalizeUserCategories = (values: readonly string[] | undefined): UserCategory[] =>
  Array.from(
    new Set((values ?? []).map(toUserCategory).filter((category): category is UserCategory => category !== undefined)),
  );

/** Translation key under `global.user-category` for an API role name; `undefined` when the role is unknown. */
export const userCategoryLabelKey = (value: string): string | undefined => {
  const category = toUserCategory(value);

  return category ? USER_CATEGORIES[category] : undefined;
};
