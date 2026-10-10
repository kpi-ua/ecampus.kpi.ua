import { CuratorAttestationTotals } from '@/app/[locale]/(private)/module/curatorlecturer/types';
interface Filters {
  search: string;
  onlyNotAttested: boolean;
  onlyRepeated: boolean;
  showRepeated: boolean;
}
export const filterAttestationResults = <T extends CuratorAttestationTotals & { notAttestedTwiceCount: number }>(
  items: T[],
  getSearchText: (item: T) => string,
  filters: Filters,
) => {
  const { search, onlyNotAttested, onlyRepeated, showRepeated } = filters;
  const query = search.trim().toLocaleLowerCase();
  return items.filter(
    (item) =>
      getSearchText(item).toLocaleLowerCase().includes(query) &&
      (!onlyNotAttested || item.notAttested > 0) &&
      (!showRepeated || !onlyRepeated || item.notAttestedTwiceCount > 0),
  );
};
