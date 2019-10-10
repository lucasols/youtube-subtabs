import * as React from 'react';

import App from 'containers/App';
import GlobalStyle from 'src/react/style/GlobalStyle';
import DebugLayout from 'src/react/style/DebugLayout';

const Root = () => (
  <React.StrictMode>
    {__DEV__ && <DebugLayout />}
    <GlobalStyle />
    <App />
  </React.StrictMode>
);

export default Root;
