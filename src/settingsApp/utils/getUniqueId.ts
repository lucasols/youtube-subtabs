import { obj } from 'src/typings/utils';

export function getUniqueId(items: ({ id: any } & obj)[]) {
  const numIds = items.filter(item => typeof item.id === 'number');

  return numIds.length === 0 ? 1 : Math.max(...numIds.map(item => item.id)) + 1;
}
