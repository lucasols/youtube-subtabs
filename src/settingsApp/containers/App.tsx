import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { fillContainer, centerContent, centerContentCollum } from 'settingsApp/style/modifiers';
import { colorBg, fontPrimary } from 'settingsApp/style/theme';
import Home from 'settingsApp/containers/Home';
import EditTab from 'settingsApp/containers/EditTab';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import DeleteTabModal from 'settingsApp/containers/DeleteTabModal';
import EditFilter from 'settingsApp/containers/EditFilter';
import DeleteFilterModal from 'settingsApp/containers/DeleteFilterModal';
import TestSubTabs from 'settingsApp/components/TestSubTabs';

const AppContainer = styled.div`
  ${fillContainer};
  background: ${colorBg};
  overflow: hidden;
`;

const App = () => {
  useEffect(() => {
    // fetchCities();
  }, []);

  return (
    <AppContainer>
      {__DEV__ && <TestSubTabs />}
      <Home />
      <EditTab />
      <EditFilter />
      <DeleteTabModal />
      <DeleteFilterModal />
    </AppContainer>
  );
};

export default App;
