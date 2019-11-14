import filtersState, { FilterProps } from 'settingsApp/state/filtersState';
import tabsState, { TabProps } from 'settingsApp/state/tabsState';

export type ChromeStorage = {
  tabs?: Omit<TabProps, 'children' | 'isInvalid'>[];
  filters?: Omit<FilterProps, 'children' | 'isInvalid'>[];
};

export function initializeTabsSubscriber() {
  if (module.hot) return;

  tabsState.subscribe((prev, current) => {
    if (prev === current) return;

    const chromeSet: ChromeStorage = {
      tabs: current.tabs.map(({ children, isInvalid, ...rest }) => ({
        ...rest,
      })),
    };

    chrome.storage.local.set(chromeSet, () => {
      console.log('tabs local settings updated!');
    });
  });
}

export function initializeFiltersSubscriber() {
  if (module.hot) return;

  filtersState.subscribe((prev, current) => {
    if (prev === current) return;

    const chromeSet: ChromeStorage = {
      filters: current.filters.map(({ children, isInvalid, ...rest }) => ({
        ...rest,
      })),
    };

    chrome.storage.local.set(chromeSet, () => {
      console.log('filter local settings updated!');
    });
  });
}
