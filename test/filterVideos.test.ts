import { checkIfExcludeVideo } from 'utils/filterVideos';
import { FilterProps } from 'settingsApp/state/filtersState';
import testData from './testData';

function getFilterById(
  id: FilterProps['id'],
  filters: FilterProps[] = testData.filters,
) {
  return (
    filters.find((item: typeof filters[0]) => item.id === id) || filters[0]
  );
}

const testVideo = {
  userName: 'Kurzgesagt – In a Nutshell',
  userId: 'Kurzgesagt',
  videoName: 'Neutron Stars – The Most Extreme Things that are not Black Holes',
  dayOfWeek: 4,
};

const filter2: FilterProps = {
  id: 2,
  daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  name: '',
  tabs: [],
  type: 'include',
  userName: 'Kurzgesagt – In a Nutshell',
  userId: '',
  videoNameRegex: '98958',
};

describe('checkIfExcludeVideo', () => {
  describe('inclusion', () => {
    test('with no include filters', () => {
      const result = checkIfExcludeVideo(testVideo, [], []);

      expect(result).toMatchObject({
        excludeVideo: false,
        includeBasedOnFilter: undefined,
      });
    });

    test('based on userName and userId', () => {
      const filter: FilterProps = {
        id: 0,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'include',
        userName: 'Kurzgesagt – In a Nutshell',
        userId: 'Kurzgesagt',
        videoNameRegex: '',
      };
      const result = checkIfExcludeVideo(testVideo, [filter, filter2], []);

      expect(result).toMatchObject({
        excludeVideo: false,
        includeBasedOnFilter: 0,
        includeBasedOnFields: ['userName'],
      });
    });

    test('based on userName and fallback to userId', () => {
      const filter: FilterProps = {
        id: 0,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'include',
        userName: 'Kurzgesagt',
        userId: 'Kurzgesagt',
        videoNameRegex: '',
      };
      const result = checkIfExcludeVideo(testVideo, [filter, filter2], []);

      expect(result).toMatchObject({
        excludeVideo: false,
        includeBasedOnFilter: 0,
        includeBasedOnFields: ['userId'],
      });
    });

    test('based on userName only', () => {
      const filter: FilterProps = {
        id: 0,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'include',
        userName: 'Kurzgesagt – In a Nutshell',
        userId: '',
        videoNameRegex: '',
      };
      const result = checkIfExcludeVideo(testVideo, [filter, filter2], []);

      expect(result).toMatchObject({
        excludeVideo: false,
        includeBasedOnFilter: 0,
        includeBasedOnFields: ['userName'],
      });
    });

    test('based on userId only', () => {
      const filter: FilterProps = {
        id: 0,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'include',
        userName: '',
        userId: 'Kurzgesagt',
        videoNameRegex: '',
      };
      const result = checkIfExcludeVideo(testVideo, [filter, filter2], []);

      expect(result).toMatchObject({
        excludeVideo: false,
        includeBasedOnFilter: 0,
        includeBasedOnFields: ['userId'],
      });
    });

    test('based on videoName', () => {
      const filter: FilterProps = {
        id: 1,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'include',
        userName: '',
        userId: '',
        videoNameRegex: 'Neutron Stars',
      };
      const result = checkIfExcludeVideo(testVideo, [filter, filter2], []);

      expect(result).toMatchObject({
        excludeVideo: false,
        includeBasedOnFilter: 1,
        includeBasedOnFields: ['videoName'],
      });
    });

    test('based on videoName and userId', () => {
      const filter: FilterProps = {
        id: 1,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'include',
        userName: '',
        userId: 'Kurzgesagt',
        videoNameRegex: 'Neutron Stars',
      };
      const result = checkIfExcludeVideo(testVideo, [filter, filter2], []);

      expect(result).toMatchObject({
        excludeVideo: false,
        includeBasedOnFilter: 1,
        includeBasedOnFields: ['userId', 'videoName'],
      });
    });

    describe('fails', () => {
      test('at days of week but matches the videoName', () => {
        const filter: FilterProps = {
          id: 1,
          daysOfWeek: [1, 2, 3, 5, 6],
          name: '',
          tabs: [],
          type: 'include',
          userName: '',
          userId: '',
          videoNameRegex: 'Neutron Stars',
        };
        const result = checkIfExcludeVideo(testVideo, [filter, filter2], []);

        expect(result).toMatchObject({
          excludeVideo: true,
        });
      });

      test('at userName', () => {
        const filter: FilterProps = {
          id: 0,
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          name: '',
          tabs: [],
          type: 'include',
          userName: 'Kurzgsdfl',
          userId: '',
          videoNameRegex: '',
        };
        const result = checkIfExcludeVideo(testVideo, [filter, filter2], []);

        expect(result).toMatchObject({
          excludeVideo: true,
          includeBasedOnFilter: undefined,
        });
      });

      test('at userId', () => {
        const filter: FilterProps = {
          id: 0,
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          name: '',
          tabs: [],
          type: 'include',
          userName: '',
          userId: 'dfsdfsdf',
          videoNameRegex: '',
        };
        const result = checkIfExcludeVideo(testVideo, [filter, filter2], []);

        expect(result).toMatchObject({
          excludeVideo: true,
          includeBasedOnFilter: undefined,
        });
      });

      test('at videoName', () => {
        const filter: FilterProps = {
          id: 0,
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          name: '',
          tabs: [],
          type: 'include',
          userName: '',
          userId: '',
          videoNameRegex: 'dsfsdf',
        };
        const result = checkIfExcludeVideo(testVideo, [filter, filter2], []);

        expect(result).toMatchObject({
          excludeVideo: true,
          includeBasedOnFilter: undefined,
        });
      });

      test('channel only not fails on videoNameRegex only filters', () => {
        const result = checkIfExcludeVideo(
          {
            userName: 'Coisa Nossa',
            userId: 'UCbtlMIfdRVxPXZ1nI8NBN2A',
            videoName: '',
            dayOfWeek: 4,
          },
          [getFilterById(29)],
          [],
        );

        expect(result).toEqual({
          excludeVideo: true,
          includeBasedOnFilter: undefined,
          includeBasedOnFields: [],
          excludeBasedOnFilter: undefined,
          excludeBasedOnFields: [],
        });
      });
    });
  });

  describe('exclusion', () => {
    test('based on userName and userId', () => {
      const filter: FilterProps = {
        id: 5,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'exclude',
        userName: 'Kurzgesagt – In a Nutshell',
        userId: 'Kurzgesagt',
        videoNameRegex: '',
      };
      const result = checkIfExcludeVideo(testVideo, [], [filter, filter2]);

      expect(result).toMatchObject({
        excludeVideo: true,
        excludeBasedOnFilter: 5,
        excludeBasedOnFields: ['userName'],
      });
    });

    test('based on userName and fallback to userId', () => {
      const filter: FilterProps = {
        id: 0,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'exclude',
        userName: 'Kurzgesagt',
        userId: 'Kurzgesagt',
        videoNameRegex: '',
      };
      const result = checkIfExcludeVideo(testVideo, [], [filter, filter2]);

      expect(result).toMatchObject({
        excludeVideo: true,
        excludeBasedOnFilter: 0,
        excludeBasedOnFields: ['userId'],
      });
    });

    test('based on userName', () => {
      const filter: FilterProps = {
        id: 0,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'exclude',
        userName: 'Kurzgesagt – In a Nutshell',
        userId: '',
        videoNameRegex: '',
      };
      const result = checkIfExcludeVideo(testVideo, [], [filter, filter2]);

      expect(result).toMatchObject({
        excludeVideo: true,
        excludeBasedOnFilter: 0,
        excludeBasedOnFields: ['userName'],
      });
    });

    test('based on userId', () => {
      const filter: FilterProps = {
        id: 0,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'exclude',
        userName: '',
        userId: 'Kurzgesagt',
        videoNameRegex: '',
      };
      const result = checkIfExcludeVideo(testVideo, [], [filter, filter2]);

      expect(result).toMatchObject({
        excludeVideo: true,
        excludeBasedOnFilter: 0,
        excludeBasedOnFields: ['userId'],
      });
    });

    test('based on videoName and userName or userId', () => {
      const filter: FilterProps = {
        id: 1,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'exclude',
        userName: '',
        userId: 'Kurzgesagt',
        videoNameRegex: 'Neutron Stars',
      };
      const result = checkIfExcludeVideo(testVideo, [], [filter, filter2]);

      expect(result).toMatchObject({
        excludeVideo: true,
        excludeBasedOnFilter: 1,
        excludeBasedOnFields: ['userId', 'videoName'],
      });
    });

    test('based on videoName', () => {
      const filter: FilterProps = {
        id: 1,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        name: '',
        tabs: [],
        type: 'exclude',
        userName: '',
        userId: '',
        videoNameRegex: 'Neutron Stars',
      };
      const result = checkIfExcludeVideo(testVideo, [], [filter, filter2]);

      expect(result).toMatchObject({
        excludeVideo: true,
        excludeBasedOnFilter: 1,
        excludeBasedOnFields: ['videoName'],
      });
    });

    describe('fails', () => {
      test('at dayOfWeek', () => {
        const filter: FilterProps = {
          id: 1,
          daysOfWeek: [1, 2, 3, 5, 6],
          name: '',
          tabs: [],
          type: 'exclude',
          userName: '',
          userId: '',
          videoNameRegex: 'Neutron Stars',
        };
        const result = checkIfExcludeVideo(testVideo, [], [filter, filter2]);

        expect(result).toMatchObject({
          excludeVideo: false,
        });
      });
    });
  });
});
