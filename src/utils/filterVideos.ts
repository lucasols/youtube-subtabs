import { TabProps } from 'settingsApp/state/tabsState';
import { FilterProps } from 'settingsApp/state/filtersState';

export function checkIfExcludeVideo(
  {
    userName,
    userId,
    videoName,
    dayOfWeek,
  }: {
    userName: string;
    userId: string;
    videoName: string;
    dayOfWeek: number | null;
  },
  includeFilters: FilterProps[],
  excludeFilters: FilterProps[],
) {
  let includeVideo = false;
  let includeBasedOnFilter: number | undefined;
  const includeBasedOnFields: ('userName' | 'userId' | 'videoName')[] = [];
  let excludeBasedOn: string | undefined;

  if (includeFilters.length === 0) {
    includeVideo = true;
  } else {
    for (let i = 0; i < includeFilters.length; i++) {
      const {
        userName: filterUserName,
        userId: filterUserId,
        daysOfWeek,
        id,
        videoNameRegex,
      } = includeFilters[i];

      let userMatches = !(filterUserName || filterUserId);

      if (filterUserName && filterUserName === userName) {
        userMatches = true;
        includeBasedOnFilter = id;
        includeBasedOnFields.push('userName');
      }

      if (!userMatches && filterUserId && filterUserId === userId) {
        userMatches = true;
        includeBasedOnFilter = id;
        includeBasedOnFields.push('userId');
      }

      let videoNameMatches = !videoNameRegex;

      if (
        userMatches &&
        videoNameRegex &&
        new RegExp(videoNameRegex, 'i').test(videoName)
      ) {
        videoNameMatches = true;
        includeBasedOnFilter = id;
        includeBasedOnFields.push('videoName');
      }

      // let dayOfWeekMatches =

      includeVideo = videoNameMatches && userMatches;
      break;
    }
  }

  return {
    excludeVideo: !includeVideo,
    includeBasedOnFilter,
    includeBasedOnFields,
    excludeBasedOn,
  };
}

function checkVideo(
  element: HTMLDivElement,
  includeFilters: FilterProps[],
  excludeFilters: FilterProps[],
) {
  const userNameElement = element.querySelector<HTMLAnchorElement>(
    '#channel-name a',
  );

  const videoName = element.querySelector<HTMLDivElement>('#video-title')
    ?.innerText;
  const userId = userNameElement?.href.replace(
    /https:\/\/www.youtube.com\/(user|channel)\//,
    '',
  );
  const userName = userNameElement?.innerText;
  const timeOfUpload = element.querySelector<HTMLSpanElement>(
    '#metadata-line > span:nth-child(2)',
  )?.innerText;

  if (!videoName || !userId || !userName) return false;

  const today = new Date();
  let dayOfWeek: number | null = null;

  if (timeOfUpload && /hour|minute/.test(timeOfUpload)) {
    const hours = /(\d+) hour/.exec(timeOfUpload)?.[1];
    const minutes = /(\d+) minute/.exec(timeOfUpload)?.[1];

    if (hours) {
      today.setHours(today.getHours() - +hours);
    } else if (minutes) {
      today.setMinutes(today.getMinutes() - +minutes);
    }

    dayOfWeek = today.getDay();
  }

  const excludeVideo = checkIfExcludeVideo(
    {
      userId,
      userName,
      videoName,
      dayOfWeek,
    },
    includeFilters,
    excludeFilters,
  );

  return {
    exclude: excludeVideo,
  };
}

let lastFilteredVideo = -1;
let lastRunId = '';

export function filterVideos(
  active: 'all' | number,
  tabs: TabProps[],
  filters: FilterProps[],
) {
  const videosElements = document.querySelectorAll<HTMLDivElement>(
    '#items > ytd-grid-video-renderer',
  );

  const activeTab = tabs.find(item => item.id === active);
  let activeFilters = filters.filter(item => item.tabs.includes(active));

  if (active !== 'all') {
    activeFilters = [
      ...filters.filter(item => item.tabs.includes('all')),
      ...activeFilters,
      ...(activeTab?.includeChildsFilter
        ? tabs
            .filter(item => item.parent === activeTab.id)
            .reduce(
              (prev, curr) => [
                ...prev,
                ...filters.filter(item => item.tabs.includes(curr.id)),
              ],
              [],
            )
        : []),
    ];
  }

  activeFilters = activeFilters.filter(
    (filter, index, self) =>
      (filter.userId !== '' || filter.videoNameRegex !== '') &&
      index === self.findIndex(t => t.id === filter.id),
  );

  const excludeFilters = activeFilters.filter(item => item.type === 'exclude');
  const includeFilters = activeFilters.filter(item => item.type === 'include');

  const runId = JSON.stringify([activeTab?.id, activeFilters]);

  if (runId !== lastRunId) {
    lastRunId = runId;
    lastFilteredVideo = -1;

    if (videosElements.length > 393) {
      window.location.reload(false);
      return;
    }
  }

  // console.time(`videos-${videosElements.length}`);

  for (let i = lastFilteredVideo + 1; i < videosElements.length; i++) {
    const videoProps = checkVideo(
      videosElements[i],
      includeFilters,
      excludeFilters,
    );

    if (videoProps) {
      if (videoProps.exclude) {
        videosElements[i].style.display = 'none';
      } else {
        videosElements[i].style.display = 'block';
      }
    }
  }

  lastFilteredVideo = videosElements.length - 1;

  // console.timeEnd(`videos-${videosElements.length}`);
}
