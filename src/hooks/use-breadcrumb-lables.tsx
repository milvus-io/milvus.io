import { findActiveMenuItem } from '@/utils';
import { useMemo } from 'react';

export const useBreadcrumbLabels = (params: {
  currentId: string;
  groupId?: string;
  menu: any[];
}) => {
  const { currentId, menu } = params;

  const generateActiveLabels = (menus: any[], ids: string[]) => {
    const labels: string[] = [];
    const walkThroughMenu = (list: any[], ids: string[]) => {
      list.forEach(item => {
        const { children, id } = item;
        if (children.length) {
          ids.includes(id) && labels.push(item.label);
          children.length && walkThroughMenu(children, ids);
        } else {
          ids.includes(id) && labels.push(item.label);
        }
      });

      return list;
    };
    walkThroughMenu(menus, ids);
    return labels;
  };

  const activeLabels = useMemo(() => {
    const expandedIds = findActiveMenuItem({
      mdId: currentId,
      menu: menu,
    });

    return generateActiveLabels(menu, [...expandedIds, currentId]);
  }, [menu, currentId]);

  return activeLabels;
};
