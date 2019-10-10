import { obj } from 'src/typings/utils';

export function getUniqueId(items: ({ id: any } & obj)[]) {
  return Math.max(...items.map(item => item.id)) + 1;
}
