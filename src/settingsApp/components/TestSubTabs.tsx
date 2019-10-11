import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import ReactDOM from 'react-dom';
import SubTabs from 'subTabs/Root';
import Button from 'settingsApp/components/Button';

const Container = styled.div`
  position: relative;
  font-family: 'Roboto';
  width: 40%;
  height: 100%;
  overflow-y: auto;
  z-index: 1000;
  margin: 0 auto;
  background: #333;
`;

const TestSubTabs = () => {
  useEffect(() => {
    ReactDOM.render(<SubTabs />, document.getElementById('youtube-subtabs'));
  }, []);

  return (
    <Container>
      <div
        id="youtube-subtabs"
        css={{
          height: 28,
          marginTop: 24,
        }}
      />
      <h1>Teste</h1>
      <Button label="test" />
      <div css={{ height: 2000 }} />
    </Container>
  );
};

export default TestSubTabs;
