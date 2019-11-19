import testData from './testData';
import { getSearchFields, checkIfFieldsMatchesItem } from 'utils/search';
import { FilterProps } from 'settingsApp/state/filtersState';

function getFilterById(id: FilterProps['id'], filters: FilterProps[]) {
  return filters.find((item: typeof filters[0]) => item.id === id);
}

describe('get query fields', () => {
  describe('test fields', () => {
    test('generic search', () => {
      const query = 'pesquisa com o uso de espaços';

      expect(getSearchFields(query)).toEqual({
        generic: query,
      });

      expect(getSearchFields('test ')).toEqual({
        generic: 'test',
      });
    });

    test('name', () => {
      expect(getSearchFields('(name:react conf )')).toEqual({
        name: 'react conf',
      });
    });

    test('id', () => {
      expect(getSearchFields('(id:82 )')).toEqual({
        id: 82,
      });
    });

    test('tabs', () => {
      expect(getSearchFields('(tabs:14,12)')).toEqual({
        tabs: [14, 12],
      });

      expect(getSearchFields('(tabs: 14, 12 )')).toEqual({
        tabs: [14, 12],
      });

      expect(getSearchFields('(tabs: 14, all )')).toEqual({
        tabs: [14, 'all'],
      });

      expect(getSearchFields('(tabs: empty)')).toEqual({
        tabs: [],
      });
    });

    test('type', () => {
      expect(getSearchFields('(type:  include)')).toEqual({
        type: 'include',
      });

      expect(getSearchFields('(type:  exclude)')).toEqual({
        type: 'exclude',
      });
    });

    test('userName', () => {
      expect(getSearchFields('(userName: FreeCodeCamp)')).toEqual({
        userName: 'FreeCodeCamp',
      });
    });

    test('userId', () => {
      expect(getSearchFields('(userId: FreeCodeCamp)')).toEqual({
        userId: 'FreeCodeCamp',
      });
    });

    test('videoName', () => {
      expect(getSearchFields('(videoName:  FreeCodeCamp)')).toEqual({
        videoName: 'FreeCodeCamp',
      });
    });

    test('escape (', () => {
      expect(getSearchFields('(videoName: FreeCodeCamp (2\\))')).toEqual({
        videoName: 'FreeCodeCamp (2)',
      });

      expect(getSearchFields('(videoName: FreeCodeCamp (2\\) )')).toEqual({
        videoName: 'FreeCodeCamp (2)',
      });

      expect(
        getSearchFields('(videoName: FreeCodeCamp (2\\) \\) (\\) )'),
      ).toEqual({
        videoName: 'FreeCodeCamp (2) ) ()',
      });

      expect(getSearchFields('(videoName: FreeCodeCamp(2\\) Conf)')).toEqual({
        videoName: 'FreeCodeCamp(2) Conf',
      });

      expect(
        getSearchFields('(videoName: FreeCodeCamp(2\\)\\)\\)(\\) Conf)'),
      ).toEqual({
        videoName: 'FreeCodeCamp(2)))() Conf',
      });
    });
  });

  describe('multiple', () => {
    test('generic search with all fields', () => {
      const query =
        'generic search (id: 5) (videoName: FreeCodeCamp(2\\) Conf \\) () (name: lucas) (tabs:1,2, 3 ,4) (type:include) (userName:lucas channel) (userId:lucaslos)';

      expect(getSearchFields(query)).toEqual({
        generic: 'generic search',
        name: 'lucas',
        id: 5,
        tabs: [1, 2, 3, 4],
        type: 'include',
        userName: 'lucas channel',
        userId: 'lucaslos',
        videoName: 'FreeCodeCamp(2) Conf ) (',
      });
    });

    test('generic search at end with all fields', () => {
      const query =
        '(id: 5) (videoName: FreeCodeCamp(2\\) Conf \\) () (name: lucas) (tabs:1,2, 3 ,4) (type:include) (userName:lucas channel) (userId:lucaslos) generic search ';

      expect(getSearchFields(query)).toEqual({
        generic: 'generic search',
        name: 'lucas',
        id: 5,
        tabs: [1, 2, 3, 4],
        type: 'include',
        userName: 'lucas channel',
        userId: 'lucaslos',
        videoName: 'FreeCodeCamp(2) Conf ) (',
      });
    });

    test('generic search between with all fields', () => {
      const query =
        '(id: 5) (videoName: FreeCodeCamp(2\\) Conf \\) () (name: lucas) generic search (tabs:1,2, 3 ,4) (type:include) (userName:lucas channel) (userId:lucaslos)';

      expect(getSearchFields(query)).toEqual({
        generic: 'generic search',
        name: 'lucas',
        id: 5,
        tabs: [1, 2, 3, 4],
        type: 'include',
        userName: 'lucas channel',
        userId: 'lucaslos',
        videoName: 'FreeCodeCamp(2) Conf ) (',
      });
    });

    test('generic search in start, end and between with all fields', () => {
      const query =
        'start (id: 5) (videoName: FreeCodeCamp(2\\) Conf \\) ()middle (name: lucas)middle (tabs:1,2, 3 ,4) (type:include) (userName:lucas channel) (userId:lucaslos)end';

      expect(getSearchFields(query)).toEqual({
        generic: 'start middle middle end',
        name: 'lucas',
        id: 5,
        tabs: [1, 2, 3, 4],
        type: 'include',
        userName: 'lucas channel',
        userId: 'lucaslos',
        videoName: 'FreeCodeCamp(2) Conf ) (',
      });
    });
  });

  test('empty input', () => {
    expect(getSearchFields('')).toBeFalsy();
  });
});

describe('check if query matches item', () => {
  const getFilter = (id: number) =>
    getFilterById(id, testData.filters) || testData.filters[0];

  const checkFilter = (query: string, id: number) =>
    checkIfFieldsMatchesItem(getSearchFields(query), getFilter(id));

  test('id', () => {
    expect(checkFilter('(id: 2) (name: sei lá)', 2)).toEqual({
      matches: true,
      matchedOn: ['id'],
      failedOn: [],
    });
  });

  test('tabs', () => {
    expect(checkFilter('(tabs: 25)', 3)).toEqual({
      matches: true,
      matchedOn: ['tabs'],
      failedOn: [],
    });
    expect(checkFilter('(tabs: 25, 1)', 3)).toEqual({
      matches: true,
      matchedOn: ['tabs'],
      failedOn: [],
    });
    expect(checkFilter('(tabs: 1, 25)', 3)).toEqual({
      matches: true,
      matchedOn: ['tabs'],
      failedOn: [],
    });
  });

  test('filter emulation', () => {
    expect(checkFilter('', 3)).toEqual({
      matches: false,
      matchedOn: [],
      failedOn: [],
    });

    expect(
      checkFilter(
        '(userName: 3Blue1Brown) (userId: UCYO_jab_esuFRV4b17AJtAw)',
        3,
      ),
    ).toEqual({
      matches: true,
      matchedOn: ['filterTest', 'userName'],
      failedOn: [],
    });

    expect(
      checkFilter(
        '(userName:Varanda Gourmet) (userId:UCkI99TG1VfkUCS6HAtLj4cg)',
        48,
      ),
    ).toEqual({
      matches: true,
      matchedOn: ['filterTest', 'userId'],
      failedOn: [],
    });
  });

  test('name', () => {
    expect(checkFilter('(name: 3Blue1Brown)', 3)).toEqual({
      matches: true,
      matchedOn: ['name'],
      failedOn: [],
    });
  });

  test('type', () => {
    expect(checkFilter('(type: include)', 3)).toEqual({
      matches: true,
      matchedOn: ['type'],
      failedOn: [],
    });
  });

  test('generic', () => {
    expect(checkFilter('3blue', 3)).toEqual({
      matches: true,
      matchedOn: ['generic'],
      failedOn: [],
    });

    expect(checkFilter('(tabs: 25) UCYO', 3)).toEqual({
      matches: true,
      matchedOn: ['tabs', 'generic'],
      failedOn: [],
    });

    expect(checkFilter('*', 3)).toEqual({
      matches: true,
      matchedOn: ['generic'],
      failedOn: [],
    });

    expect(checkFilter('test', 3)).toMatchObject({
      matches: false,
    });
  });

  test('generic accent insensitive', () => {
    expect(checkFilter('mauricio', 13)).toMatchObject({
      matches: true,
    });

    expect(checkFilter('maurício', 13)).toMatchObject({
      matches: true,
    });
  });

  test('no results', () => {
    expect(checkFilter('', 3)).toEqual({
      matches: false,
      matchedOn: [],
      failedOn: [],
    });
  });

  test('mixed fails', () => {
    expect(checkFilter('* (type: exclude)', 3)).toEqual({
      matches: false,
      matchedOn: ['generic'],
      failedOn: ['type'],
    });
  });

  test('not throw invalid regex error', () => {
    expect(() => checkFilter('(', 3)).not.toThrow();
  });
});
