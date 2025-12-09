export interface WorkPlace {
  id: number;
  name: string;
}

export interface RatingSummary {
  employeeId: number;
  subdivisionName: string;
  workKindId: number;
  workKindName: string;
  sumResult: number;
  entryCount: number;
}

export interface RatingEntry {
  ratingTextId: number;
  employeeId: number;
  subdivisionName: string;
  studyingYearId: number;
  text: string;
  textFull: string;
  time: number;
  quantity: number;
  quantityPercent: number;
  result: number;
  status: number;
  markId: number;
  mark: number;
  loadId: number;
  loadSubTreeNumber: number;
  loadName: string;
  loadStatus: number;
  treeId: number;
  treeSubTreeNumber: number;
  treeName: string;
  workKindId: number;
  workKindSubTreeNumber: number;
  workKindName: string;
}

export interface WorkPlaceRating {
  workPlace: WorkPlace;
  summary: RatingSummary[];
  entries: RatingEntry[];
  totalResult: number;
  totalEntryCount: number;
}

export interface RatingData {
  years: {
    [year: string]: WorkPlaceRating[];
  };
}
