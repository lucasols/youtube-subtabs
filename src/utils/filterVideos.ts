import { TabProps } from 'settingsApp/state/tabsState';
import { FilterProps } from 'settingsApp/state/filtersState';

// TODO: day of week check
// TODO: use for loops
// IDEA: chache checks for better perf
export function checkIfExcludeVideo(userName: string, videoName: string, includeFilters: FilterProps[], excludeFilters: FilterProps[]) {
  const includeVideo = includeFilters.length === 0 ? true : includeFilters.some(filter => {
    let include = false;

    if (filter.userRegex && new RegExp(filter.userRegex, 'i').test(userName)) {
      include = true;
    }

    if (filter.videoNameRegex && new RegExp(filter.videoNameRegex, 'i').test(videoName)) {
      include = true;
    }

    return include;
  });

  if (!includeVideo) return true;

  return excludeFilters.some(filter => {
    let exclude = false;

    if (filter.userRegex && new RegExp(filter.userRegex, 'i').test(userName)) {
      exclude = true;
    }

    if (filter.videoNameRegex && new RegExp(filter.videoNameRegex, 'i').test(videoName)) {
      exclude = true;
    }

    return exclude;
  });
}

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

  videosElements.forEach(element => {
    const videoName = element.querySelector<HTMLDivElement>('#video-title')?.innerText;
    // const userName = element.querySelector<HTMLAnchorElement>('yt-formatted-string a')?.href.replace(/https:\/\/www.youtube.com\/(user|channel)\//, '');
    const userName = element.querySelector<HTMLAnchorElement>('yt-formatted-string a')?.href;
    const timeOfUpload = element.querySelector<HTMLSpanElement>('#metadata-line > span:nth-child(2)')?.innerText;

    if (!videoName || !userName || !timeOfUpload) return;

    const today = new Date();
    let dayOfWeek: number | null = null;

    if (/hour|minute/.test(timeOfUpload)) {
      dayOfWeek = today.getDay();
    } else {
      const daysAgo = /(\d+) day/.exec(timeOfUpload)?.[1];

      if (daysAgo) {
        const uploadDate = today.setDate(today.getDate() - +daysAgo);
        dayOfWeek = new Date(uploadDate).getDay();
      }
    }

    const excludeVideo = checkIfExcludeVideo(userName, videoName, includeFilters, excludeFilters);

    if (excludeVideo) {
      element.style.display = 'none';
    } else {
      element.style.display = 'block';
    }
  });
}
