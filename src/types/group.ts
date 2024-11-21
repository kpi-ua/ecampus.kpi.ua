import { Cathedra } from './cathedra';
import { Curator } from './curator';

export interface Group {
  id: number;
  name: string;
  cathedra: Cathedra;
  curator: Curator;
}