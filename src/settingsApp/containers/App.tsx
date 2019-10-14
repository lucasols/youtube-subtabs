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

const AppContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background: ${colorBg};
  overflow: hidden;
`;

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

      validate(result?.tabs, TabsValidator, (value) => {
        const globalTabs = value.filter(tab => tab.id === 'all').length;

        if (globalTabs === 1) {
          tabsState.setKey('tabs', value);
          initializeTabsSubscriber();
        } else if (value.length === 0) {
          initializeTabsSubscriber();
          tabsState.setKey('tabs', [globalTab]);
        } else {
          onInvalidTabs();
        }
      }, onInvalidTabs);

      validate(result?.filters, FiltersValidator, (value) => {
        filtersState.setKey('filters', value);
      }, downloadData);
      initializeFiltersSubscriber();
    });
  }, []);

  return (
    <AppContainer>
      {/* {!!module.hot && <TestSubTabs />} */}
      <Home />
      <EditTab />
      <EditFilter />
      <DeleteTabModal />
      <DeleteFilterModal />
    </AppContainer>
  );
};

export default App;
