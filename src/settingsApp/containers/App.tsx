import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { fillContainer, centerContent } from 'settingsApp/style/modifiers';
import { colorBg, fontPrimary } from 'settingsApp/style/theme';
import Home from 'settingsApp/containers/Home';
import EditTab from 'settingsApp/containers/EditTab';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import DeleteTabModal from 'settingsApp/containers/DeleteTabModal';
import EditFilter from 'settingsApp/containers/EditFilter';
import DeleteFilterModal from 'settingsApp/containers/DeleteFilterModal';

const AppContainer = styled.div`
  ${fillContainer};
  ${centerContent};
  align-items: flex-start;

  background: ${colorBg};
  overflow: hidden;
`;

const App = () => {
  useEffect(() => {
    // fetchCities();
  }, []);

  return (
    <AppContainer>
      <Home />
      <EditTab />
      <EditFilter />
      <DeleteTabModal />
      <DeleteFilterModal />
    </AppContainer>
  );
};

export default App;
