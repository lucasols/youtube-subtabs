import { FilterProps } from 'settingsApp/state/filtersState';
import { forEachMatch } from '@lucasols/utils';
import { any } from 'io-ts';

function stringToNum(string: string) {
  return !Number.isNaN(+string) ? +string : undefined;
}

const fieldsParsers = {
  string: (value: string) => value.trim().replace(/\\/g, ''),
  numArray: (value: string) => {
    const array = value
      .split(',')
      .map(num => stringToNum(num))
      .filter(Boolean) as number[];

    return array.length > 0 ? array : undefined;
  },
  number: (value: string) => stringToNum(value),
};

type Fields = {
  [name: string]: keyof typeof fieldsParsers;
};

export function getQueryFields<T extends Fields>(query: string, fields: T) {
  const fieldsResult: {
    [K in keyof T]?: ReturnType<typeof fieldsParsers[T[K]]>;
  } = {};

  if (!query) return fieldsResult;

  const fieldsNameString = Object.keys(fields).join('|');
  let genericSearch = '';

  const fieldsRegex = `\\((?:${fieldsNameString}):.+?(?<!\\\\)\\)`;
  forEachMatch(
    new RegExp(
      `(?:${fieldsRegex})?(?:(?:${fieldsRegex})| |(.+?))(?:${fieldsRegex}|$)`,
      'g',
    ),
    query,
    (_, matchGroup) => {
      genericSearch += matchGroup || '';
    },
  );

  const generic = genericSearch.trim();

  Object.entries(fields).forEach(
    ([name, type]: [keyof T, keyof typeof fieldsParsers]) => {
      const { 1: value } =
        new RegExp(`\\(${name}:(.+?)(?<!\\\\)\\)`).exec(query) || [];

      if (value?.trim()) {
        const parsedValue = fieldsParsers?.[type](value);

        if (parsedValue) {
          (fieldsResult[name] as any) = parsedValue;
        }
      }
    },
  );

  return {
    ...(generic ? { generic } : {}),
    ...fieldsResult,
  };
}

export const getSearchFields = (query: string) =>
  getQueryFields(query, {
    name: 'string',
    videoNameRegex: 'string',
    tabs: 'numArray',
    type: 'string',
    userName: 'string',
    userId: 'string',
    id: 'number',
  });

export function checkIfFieldsMatchesItem(
  query: ReturnType<typeof getSearchFields>,
  item: FilterProps,
) {

}
