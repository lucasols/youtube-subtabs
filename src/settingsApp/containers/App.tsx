import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import {
  fillContainer,
  centerContent,
  centerContentCollum,
} from 'settingsApp/style/modifiers';
import { colorBg, fontPrimary } from 'settingsApp/style/theme';
import Home from 'settingsApp/containers/Home';
import EditTab from 'settingsApp/containers/EditTab';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import DeleteTabModal from 'settingsApp/containers/DeleteTabModal';
import EditFilter from 'settingsApp/containers/EditFilter';
import DeleteFilterModal from 'settingsApp/containers/DeleteFilterModal';
import TestSubTabs from 'settingsApp/components/TestSubTabs';
import tabsState from 'settingsApp/state/tabsState';
import {
  ChromeStorage,
  initializeTabsSubscriber,
  initializeFiltersSubscriber,
} from 'utils/chromeStorage';
import filtersState from 'settingsApp/state/filtersState';

const AppContainer = styled.div`
  /* ${fillContainer}; */
  position: relative;
  height: 100%;
  width: 100%;
  min-width: 500px;
  min-height: 600px;
  background: ${colorBg};
  overflow: hidden;
`;

const App = () => {
  useEffect(() => {
    if (module.hot) return;

    chrome.storage.local.get(['tabs', 'filters'], (result: ChromeStorage) => {
      if (!result.tabs || result.tabs.length === 0) {
        initializeTabsSubscriber();

        tabsState.dispatch('addTabs', [
          {
            id: 'all',
            name: 'All',
            parent: null,
            includeChildsFilter: false,
          },
        ]);
      } else {
        tabsState.setKey('tabs', result.tabs);
      }

      if (result.filters) filtersState.setKey('filters', result.filters);
      initializeFiltersSubscriber();

      console.log(result);
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
