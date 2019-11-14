import { checkIfExcludeVideo } from 'utils/filterVideos';
import { FilterProps } from 'settingsApp/state/filtersState';

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
  videoNameRegex: 'a',
};

describe('checkIfExclude video', () => {
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

    test('based on dayOfWeek', () => {
      return false;
    });

    describe('fails', () => {
      test('when userName fail', () => {
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

      test('when userId fail', () => {
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

      test('when videoName fail', () => {
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
    });
  });

  describe('exclusion', () => {
    test('with no exclude filters', () => false);

    test('based on userName and userId', () => false);

    test('based on userName and fallback to userId', () => false);

    test('based on name only', () => false);

    test('based on userId only', () => false);

    test('based on videoName and userName or userId', () => false);

    test('based on videoName', () => false);

    test('based on dayOfWeek', () => false);
  });

  test('inclusion and exclusion', () => false);
});
