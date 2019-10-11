import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { fillContainer, centerContent } from 'settingsApp/style/modifiers';
import { colorBg } from 'settingsApp/style/theme';

const AppContainer = styled.div`
  height: 80px;
  width: 100%;
`;

const App = () => {
  useEffect(() => {
    // fetchCities();
  }, []);

  return (
    <AppContainer>

    </AppContainer>
  );
};

export default App;
