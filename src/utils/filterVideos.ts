import { TabProps } from 'settingsApp/state/tabsState';
import { FilterProps } from 'settingsApp/state/filtersState';
import { memoize } from 'lodash-es';

export function checkIfExcludeVideo(userName: string, videoName: string, includeFilters: FilterProps[], excludeFilters: FilterProps[], dayOfWeek: number | null) {
  let includeVideo = false;

  if (includeFilters.length === 0) {
    includeVideo = true;
  } else {
    for (let i = 0; i < includeFilters.length; i++) {
      const filter = includeFilters[i];

      if (filter.userRegex === '' && filter.videoNameRegex === '') continue;

      if (filter.userRegex && new RegExp(filter.userRegex, 'i').test(userName)) {
        includeVideo = true;
      }

      if (filter.videoNameRegex && new RegExp(filter.videoNameRegex, 'i').test(videoName)) {
        includeVideo = true;
      }

      if (includeVideo) {
        includeVideo = dayOfWeek === null
          ? true
          : filter.daysOfWeek.includes(dayOfWeek);

        if (includeVideo) break;
      }
    }
  }

  if (!includeVideo) return true;

  let excludeVideo = false;

  for (let i = 0; i < excludeFilters.length; i++) {
    const filter = excludeFilters[i];

    if (filter.userRegex === '' && filter.videoNameRegex === '') continue;

    if (filter.userRegex && new RegExp(filter.userRegex, 'i').test(userName)) {
      excludeVideo = true;
    }

    if (filter.videoNameRegex && new RegExp(filter.videoNameRegex, 'i').test(videoName)) {
      excludeVideo = true;
    }

    if (excludeVideo) {
      excludeVideo = dayOfWeek === null
        ? true
        : filter.daysOfWeek.includes(dayOfWeek);

      if (excludeVideo) break;
    }
  }

  return excludeVideo;
}

function checkVideo(element: HTMLDivElement, includeFilters: FilterProps[], excludeFilters: FilterProps[]) {
  const videoName = element.querySelector<HTMLDivElement>('#video-title')?.innerText;
  const userName = element.querySelector<HTMLAnchorElement>('#channel-name a')?.href.replace(/https:\/\/www.youtube.com\/(user|channel)\//, '');
  const timeOfUpload = element.querySelector<HTMLSpanElement>('#metadata-line > span:nth-child(2)')?.innerText;

  if (!videoName || !userName) return;

  const today = new Date();
  let dayOfWeek: number | null = null;

  if (timeOfUpload) {
    if (/hour|minute/.test(timeOfUpload)) {
      dayOfWeek = today.getDay();
    } else {
      const daysAgo = /(\d+) day/.exec(timeOfUpload)?.[1];

      if (daysAgo) {
        const uploadDate = today.setDate(today.getDate() - +daysAgo);
        dayOfWeek = new Date(uploadDate).getDay();
      }
    }
  }

  const excludeVideo = checkIfExcludeVideo(userName, videoName, includeFilters, excludeFilters, dayOfWeek);

  if (excludeVideo) {
    element.style.display = 'none';
  } else {
    element.style.display = 'block';
  }
}

let lastFilteredVideo = -1;
let lastRunId = '';

export function filterVideos(active: 'all' | number, tabs: TabProps[], filters: FilterProps[]) {
  const videosElements = document.querySelectorAll<HTMLDivElement>('#items > ytd-grid-video-renderer');

  const activeTab = tabs.find(item => item.id === active);
  let activeFilters = filters.filter(item => item.tab === active);

  if (active !== 'all') {
    activeFilters = [
      ...filters.filter(item => item.tab === 'all'),
      ...activeFilters,
      ...(activeTab?.includeChildsFilter
        ? tabs.filter(item => item.parent === activeTab.id).reduce((prev, curr) =>
          [...prev, ...filters.filter(item => item.tab === curr.id)], [])
        : []
      ),
    ];
  }

  const excludeFilters = activeFilters.filter(item => item.type === 'exclude');
  const includeFilters = activeFilters.filter(item => item.type === 'include');

  const runId = JSON.stringify([activeTab?.id, activeFilters]);

  if (runId !== lastRunId) {
    lastRunId = runId;
    lastFilteredVideo = -1;
  }

  // console.time(`videos-${videosElements.length}`);

  for (let i = lastFilteredVideo + 1; i < videosElements.length; i++) {
    checkVideo(videosElements[i], includeFilters, excludeFilters);
  }

  lastFilteredVideo = videosElements.length - 1;

  // console.timeEnd(`videos-${videosElements.length}`);
}
