import { injectModals } from 'subTabs/injectSettingsModal';
import { name, version } from '../../package.json';
import { injectSubTab } from './injectSubTab';
import {
  initializeOnPageChangeListener,
  addPageChangeSubscriber as subscribeToPageChange,
} from './onPageChangeListener';
import {
  listenToChromeStorageChanges,
  initializeFiltersSubscriber,
  initializeTabsSubscriber,
  ChromeStorage,
} from 'utils/chromeStorage';
import tabsState from 'settingsApp/state/tabsState';
import filtersState from 'settingsApp/state/filtersState';
import { injectChannelButtons } from 'subTabs/injectChannelButtons';
import './override.css';
import 'subTabs/injectVideoDropdownButtons';

if (__PROD__) {
  console.log(`${name} v${version}`);
}

initializeOnPageChangeListener();

chrome.storage.local.get(['tabs', 'filters'], (result: ChromeStorage) => {
  if (result.tabs) tabsState.setKey('tabs', result.tabs);
  if (result.filters) filtersState.setKey('filters', result.filters);

  injectChannelButtons();
  injectSubTab();

  filtersState.subscribe((prev, current) => {
    if (prev === current) return;
    injectChannelButtons();
  });
});

listenToChromeStorageChanges();
injectModals();

subscribeToPageChange(
  /feed\/subscriptions/,
  '*[page-subtype="subscriptions"] ytd-shelf-renderer > #dismissable',
  injectSubTab,
);

subscribeToPageChange(
  /(?:channel|user)\//,
  '#buttons.ytd-c4-tabbed-header-renderer',
  injectChannelButtons,
);
