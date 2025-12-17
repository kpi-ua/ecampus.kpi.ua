import { MenuItem } from './menu-item';
import { getModuleMenuSection } from '@/actions/menu.actions';
import { CollapsibleMenuItem } from './collapsible-menu-item';
import { MenuGroup } from '@/types/menu-item-meta';

export async function ModulesMenuItems() {
  const moduleMenuSection = await getModuleMenuSection();

  const renderMenuItem = (menuGroup: MenuGroup) => {
    return (
      <MenuItem
        key={menuGroup.url}
        name={menuGroup.name}
        url={menuGroup.url}
        title={menuGroup.title}
        isExternal={menuGroup.external}
      />
    );
  };

  return (
    <>
      {moduleMenuSection.map((menuGroup) => {
        if (menuGroup.submenu && !!menuGroup.submenu.length) {
          return (
            <CollapsibleMenuItem key={menuGroup.name} title={menuGroup.title} name={menuGroup.name}>
              {menuGroup.submenu.map(renderMenuItem)}
            </CollapsibleMenuItem>
          );
        }

        return renderMenuItem(menuGroup);
      })}
    </>
  );
}
