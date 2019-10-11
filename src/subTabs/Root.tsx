import * as React from 'react';

import App from 'subTabs/containers/SubTabs';
import DebugLayout from 'settingsApp/style/DebugLayout';

const Root = () => (
  <React.StrictMode>
    {__DEV__ && <DebugLayout />}
    <App />
  </React.StrictMode>
);

export default Root;
