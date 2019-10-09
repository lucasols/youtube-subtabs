import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { fillContainer, centerContent } from 'style/modifiers';
import { colorBg, fontPrimary } from 'style/theme';
import Home from 'containers/Home';
import EditTab from 'containers/EditTab';
import { ContentWrapper } from 'components/ContentWrapper';
import DeleteTabModal from 'containers/DeleteTabModal';
import EditFilter from 'containers/EditFilter';

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
    </AppContainer>
  );
};

export default App;
