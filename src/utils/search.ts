import { FilterProps } from 'settingsApp/state/filtersState';
import { forEachMatch } from '@lucasols/utils';
import { checkIfExcludeVideo } from 'utils/filterVideos';

function stringToNum(string: string) {
  return !Number.isNaN(+string) ? +string : undefined;
}

function sanitizeRegex(string: string) {
  return string
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

const fieldsParsers = {
  string: (value: string) => value.trim().replace(/\\/g, ''),
  numOrAllOrEmptyArray: (value: string) => {
    if (value.trim() === 'empty') return [];

    const array = value
      .split(',')
      .map(item => (item.trim() === 'all' ? item.trim() : stringToNum(item)))
      .filter(Boolean) as (number | 'all')[];

    return array.length > 0 ? array : undefined;
  },
  number: (value: string) => stringToNum(value),
};

type Fields = {
  [name: string]: keyof typeof fieldsParsers;
};

export function getQueryFields<T extends Fields>(
  query: string,
  fields: T,
):
  | false
  | ({ generic?: string } & {
      [K in keyof T]?: ReturnType<typeof fieldsParsers[T[K]]>;
    }) {
  if (!query) return false;

  const fieldsResult: {
    [K in keyof T]?: ReturnType<typeof fieldsParsers[T[K]]>;
  } = {};

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
    userName: 'string',
    userId: 'string',
    videoName: 'string',
    tabs: 'numOrAllOrEmptyArray',
    type: 'string',
    id: 'number',
  });

export function checkIfFieldsMatchesItem(
  fields: ReturnType<typeof getSearchFields>,
  filter: FilterProps,
) {
  if (!fields) return { matches: false, matchedOn: [], failedOn: [] };

  const failures: string[] = [];
  const matches: string[] = [];
  const {
    generic, tabs, name, userId, userName, type, id, videoName,
  } = fields;

  const fieldMatchState: {
    [k in keyof typeof fields | 'filterTest']: null | boolean;
  } = {
    id: null,
    filterTest: null,
    name: null,
    userId: null,
    userName: null,
    videoName: null,
    tabs: null,
    generic: null,
    type: null,
  };

  if (id) {
    fieldMatchState.id = id === filter.id;
  } else {
    if (name) {
      fieldMatchState.name = name === filter.name;
    }

    if (type) {
      fieldMatchState.type = type === filter.type;
    }

    if (tabs) {
      fieldMatchState.tabs =
        tabs.length === 0
          ? filter.tabs.length === 0
          : tabs.some(tab => filter.tabs.includes(tab));
    }

    if (userId || userName || videoName) {
      const checkResult = checkIfExcludeVideo(
        {
          userId: userId ?? '',
          userName: userName ?? '',
          videoName: videoName ?? '',
          dayOfWeek: null,
        },
        [filter],
        [],
      );

      fieldMatchState.filterTest = !checkResult.excludeVideo;
      if (!checkResult.excludeVideo) {
        checkResult.includeBasedOnFields.forEach(fieldName => {
          fieldMatchState[fieldName] = true;
        });
      }
    }
  }

  if (generic) {
    fieldMatchState.generic =
      generic === '*'
      || new RegExp(sanitizeRegex(generic), 'iu').test(
        sanitizeRegex(
          [
            fieldMatchState.name === null ? filter.name : '',
            fieldMatchState.userName === null ? filter.userName : '',
            fieldMatchState.userId === null ? filter.userId : '',
            fieldMatchState.videoName === null ? filter.videoNameRegex : '',
          ].join(' '),
        ),
      );
  }

  Object.entries(fieldMatchState).forEach(([fieldName, matchResult]) => {
    if (matchResult === true) {
      matches.push(fieldName);
    } else if (matchResult === false) {
      failures.push(fieldName);
    }
  });

  return {
    matches: matches.length > 0 && failures.length === 0,
    matchedOn: matches,
    failedOn: failures,
  };
}
