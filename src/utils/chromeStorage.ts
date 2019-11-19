import filtersState, { FilterProps } from 'settingsApp/state/filtersState';
import tabsState, { TabProps } from 'settingsApp/state/tabsState';
import { deepEqual } from 'utils/deepEqual';

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

export function listenToChromeStorageChanges() {
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.tabs) {
      deepEqual(changes.tabs.newValue, tabsState.getState().tabs, (value) => {
        tabsState.setKey('tabs', value);
      });
    } else if (changes.filters) {
      deepEqual(changes.filters.newValue, tabsState.getState().tabs, (value) => {
        filtersState.setKey('filters', value);
      });
    }
  });
}
