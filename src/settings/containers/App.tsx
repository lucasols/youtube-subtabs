import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { fillContainer, centerContent } from 'style/modifiers';
import { colorBg, fontPrimary } from 'style/theme';

const AppContainer = styled.div`
  ${fillContainer};
  ${centerContent};
  align-items: flex-start;

  background: ${colorBg};
  font-family: ${fontPrimary};
  overflow: hidden;
  color: #fff;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 600px;
`;

const App = () => {
  useEffect(() => {
    // fetchCities();
  }, []);

  return (
    <AppContainer>
      <ContentWrapper>
        {/* TODO: home */}
        {/* TODO: add/edit tab page */}
        {/* TODO: add/edit filter page */}
      </ContentWrapper>
    </AppContainer>
  );
};

export default App;
