import { NestableItemBaseProps } from 'lib/react-nestable';
import { anyObject } from 'hookstated/dist/types';

export function flatToNested<T extends anyObject>(
  flat: Omit<NestableItemBaseProps<T>, 'children'>[],
) {
  return flat
    .filter(item => !item.parent)
    .map(({ id, name, parent, ...rest }) => ({
      id: id as NestableItemBaseProps<{}>['id'],
      name,
      children: flat
        .filter(child => child.parent === id)
        .map(child => ({ ...child, children: [] })),
      parent,
      ...rest,
    }));
}

export function nestedToFlat<T extends anyObject>(
  nested: NestableItemBaseProps<T>[],
) {
  const flat: NestableItemBaseProps<T>[] = [];

  flat.forEach(item => {
    type test = typeof item['id'];
  });

  nested.forEach(({ id, children, ...rest }) => {
    flat.push({
      ...rest,
      id,
      parent: null,
    } as typeof flat[0]);

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
