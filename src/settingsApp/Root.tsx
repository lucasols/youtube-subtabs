import * as React from 'react';

import App from 'settingsApp/containers/App';
import GlobalStyle from 'settingsApp/style/GlobalStyle';
import DebugLayout from 'settingsApp/style/DebugLayout';

const Root = () => (
  <React.StrictMode>
    {__DEV__ && <DebugLayout />}
    <GlobalStyle />
    <App />
  </React.StrictMode>
);

export default Root;
