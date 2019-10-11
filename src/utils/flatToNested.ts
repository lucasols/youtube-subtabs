import { NestableItemBaseProps } from 'settingsApp/lib/react-nestable';
import { anyObject } from 'hookstated/dist/types';
import { TabProps, ExclusiveTabProps } from 'settingsApp/state/tabsState';

export function flatToNested<T extends ExclusiveTabProps>(
  flat: (Omit<NestableItemBaseProps<T>, 'children'>)[],
) {
  return flat
    .filter(item => !item.parent)
    .map(({ id, name, parent, ...rest }) => ({
      id,
      name,
      children: flat
        .filter(child => child.parent === id)
        .map(child => ({ ...child, children: [] })),
      parent,
      ...rest,
    }));
}

export function nestedToFlat<T extends ExclusiveTabProps>(
  nested: NestableItemBaseProps<T>[],
) {
  const flat: NestableItemBaseProps<ExclusiveTabProps>[] = [];

  nested.forEach(({ id, children, ...rest }) => {
    flat.push({
      ...rest,
      id,
      parent: null,
    });

    if (children && children.length > 0) {
      children.forEach(child => {
        flat.push({
          ...child,
          parent: id as number,
        });
      });
    }
  });

  return flat;
}
