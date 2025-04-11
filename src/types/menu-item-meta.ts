export interface MenuGroup {
  name: string;
  title: string;
  url: string;
  external?: boolean;
  submenu?: MenuGroup[];
}
