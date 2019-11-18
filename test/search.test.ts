import testData from './testData';
import { getSearchFields } from 'utils/search';

const { filters } = testData;

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

    test('videoNameRegex', () => {
      expect(getSearchFields('(videoNameRegex:  FreeCodeCamp)')).toEqual({
        videoNameRegex: 'FreeCodeCamp',
      });
    });

    test('escape (', () => {
      expect(getSearchFields('(videoNameRegex: FreeCodeCamp (2\\))')).toEqual({
        videoNameRegex: 'FreeCodeCamp (2)',
      });

      expect(getSearchFields('(videoNameRegex: FreeCodeCamp (2\\) )')).toEqual({
        videoNameRegex: 'FreeCodeCamp (2)',
      });

      expect(
        getSearchFields('(videoNameRegex: FreeCodeCamp (2\\) \\) (\\) )'),
      ).toEqual({
        videoNameRegex: 'FreeCodeCamp (2) ) ()',
      });

      expect(
        getSearchFields('(videoNameRegex: FreeCodeCamp(2\\) Conf)'),
      ).toEqual({
        videoNameRegex: 'FreeCodeCamp(2) Conf',
      });

      expect(
        getSearchFields('(videoNameRegex: FreeCodeCamp(2\\)\\)\\)(\\) Conf)'),
      ).toEqual({
        videoNameRegex: 'FreeCodeCamp(2)))() Conf',
      });
    });
  });

  describe('multiple', () => {
    test('generic search with all fields', () => {
      const query =
        'generic search (id: 5) (videoNameRegex: FreeCodeCamp(2\\) Conf \\) () (name: lucas) (tabs:1,2, 3 ,4) (type:include) (userName:lucas channel) (userId:lucaslos)';

      expect(getSearchFields(query)).toEqual({
        generic: 'generic search',
        name: 'lucas',
        id: 5,
        tabs: [1, 2, 3, 4],
        type: 'include',
        userName: 'lucas channel',
        userId: 'lucaslos',
        videoNameRegex: 'FreeCodeCamp(2) Conf ) (',
      });
    });

    test('generic search at end with all fields', () => {
      const query =
        '(id: 5) (videoNameRegex: FreeCodeCamp(2\\) Conf \\) () (name: lucas) (tabs:1,2, 3 ,4) (type:include) (userName:lucas channel) (userId:lucaslos) generic search ';

      expect(getSearchFields(query)).toEqual({
        generic: 'generic search',
        name: 'lucas',
        id: 5,
        tabs: [1, 2, 3, 4],
        type: 'include',
        userName: 'lucas channel',
        userId: 'lucaslos',
        videoNameRegex: 'FreeCodeCamp(2) Conf ) (',
      });
    });

    test('generic search between with all fields', () => {
      const query =
        '(id: 5) (videoNameRegex: FreeCodeCamp(2\\) Conf \\) () (name: lucas) generic search (tabs:1,2, 3 ,4) (type:include) (userName:lucas channel) (userId:lucaslos)';

      expect(getSearchFields(query)).toEqual({
        generic: 'generic search',
        name: 'lucas',
        id: 5,
        tabs: [1, 2, 3, 4],
        type: 'include',
        userName: 'lucas channel',
        userId: 'lucaslos',
        videoNameRegex: 'FreeCodeCamp(2) Conf ) (',
      });
    });

    test('generic search in start, end and between with all fields', () => {
      const query =
        'start (id: 5) (videoNameRegex: FreeCodeCamp(2\\) Conf \\) ()middle (name: lucas)middle (tabs:1,2, 3 ,4) (type:include) (userName:lucas channel) (userId:lucaslos)end';

      expect(getSearchFields(query)).toEqual({
        generic: 'start middle middle end',
        name: 'lucas',
        id: 5,
        tabs: [1, 2, 3, 4],
        type: 'include',
        userName: 'lucas channel',
        userId: 'lucaslos',
        videoNameRegex: 'FreeCodeCamp(2) Conf ) (',
      });
    });
  });
});

describe('check if query matches item', () => {
  test('', () => {});
});
