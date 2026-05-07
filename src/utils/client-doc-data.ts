import { AllMdVersionIdType, FinalMenuStructureType } from '@/types/docs';

const CLIENT_MENU_KEYS = [
  'id',
  'label',
  'href',
  'parentIds',
  'externalLink',
  'children',
] as const;

export type ClientMenuItem = Pick<
  FinalMenuStructureType,
  (typeof CLIENT_MENU_KEYS)[number]
>;

export const stripMenuForClient = (
  menu: FinalMenuStructureType[]
): ClientMenuItem[] => {
  return menu.map(item => ({
    id: item.id,
    label: item.label,
    href: item.href,
    parentIds: item.parentIds || [],
    externalLink: item.externalLink || '',
    children: stripMenuForClient(item.children || []),
  }));
};

export const stripMdListDataForClient = (
  mdListData: AllMdVersionIdType[],
  currentMdId?: string
): AllMdVersionIdType[] => {
  if (!currentMdId || currentMdId === 'home') {
    return [];
  }

  return mdListData.map(({ version, mds }) => ({
    version,
    mds: mds.includes(currentMdId) ? [currentMdId] : [],
  }));
};
