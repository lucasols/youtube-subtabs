import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import DeleteFilterModal from 'settingsApp/containers/DeleteFilterModal';
import DeleteTabModal from 'settingsApp/containers/DeleteTabModal';
import EditFilter from 'settingsApp/containers/EditFilter';
import EditTab from 'settingsApp/containers/EditTab';
import Home from 'settingsApp/containers/Home';
import filtersState, { FilterProps } from 'settingsApp/state/filtersState';
import tabsState, { TabProps } from 'settingsApp/state/tabsState';
import { colorBg } from 'settingsApp/style/theme';
import { ChromeStorage, initializeFiltersSubscriber, initializeTabsSubscriber } from 'utils/chromeStorage';
import { validate } from 'utils/ioTsValidate';
import { TabsValidator, FiltersValidator } from 'settingsApp/containers/ExportImportMenu';
import { download } from 'utils/download';
import * as t from 'io-ts';
import Search from 'settingsApp/containers/Search';

const AppContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: ${colorBg};
  overflow: hidden;
`;

const ChromeStorageValidator: t.Type<ChromeStorage> = t.type({
  tabs: t.union([TabsValidator, t.undefined]),
  filters: t.union([FiltersValidator, t.undefined]),
});

const App = () => {
  useEffect(() => {
    if (module.hot) return;

    chrome.storage.local.get(['tabs', 'filters'], (result: ChromeStorage) => {
      const globalTab: TabProps = { id: 'all', name: 'All', parent: null, includeChildsFilter: false };

      function downloadData() {
        const data = window.confirm('Invalid data from chrome storage, click OK to download the current data. With this you will be able to fix the file and import it later');
        if (data) {
          download(JSON.stringify(result, undefined, 2), 'old-format-data.json', 'text/plain');
        }
      }

      function onInvalidTabs() {
        initializeTabsSubscriber();
        tabsState.setKey('tabs', [globalTab]);
        downloadData();
      }

      validate(result, ChromeStorageValidator, (chromeStorage) => {
        if (chromeStorage.tabs) {
          const globalTabs = chromeStorage.tabs.filter(tab => tab.id === 'all').length;

          if (globalTabs === 1) {
            tabsState.setKey('tabs', chromeStorage.tabs);
            initializeTabsSubscriber();
          } else if (chromeStorage.tabs.length === 0) {
            initializeTabsSubscriber();
            tabsState.setKey('tabs', [globalTab]);
          } else {
            onInvalidTabs();
          }
        } else {
          initializeTabsSubscriber();
          tabsState.setKey('tabs', [globalTab]);
        }

        if (chromeStorage.filters) {
          filtersState.setKey('filters', chromeStorage.filters);
        }
      }, () => {
        onInvalidTabs();
      });

      initializeFiltersSubscriber();
    });

    function deepEqual<T, I>(v1: T, v2: I, callback: (v1: T, v2: I) => void) {
      if (JSON.stringify(v1) !== JSON.stringify(v2)) {
        callback(v1, v2);
      }
    }

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
  }, []);

  return (
    <AppContainer>
      {/* {!!module.hot && <TestSubTabs />} */}
      <Home />
      <EditTab />
      <Search />
      <EditFilter />
      <DeleteTabModal />
      <DeleteFilterModal />
    </AppContainer>
  );
};

export default App;
