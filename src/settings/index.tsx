import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from 'Root';
import { version, name } from '../../package.json';

if (__PROD__) {
  console.log(`${name} v${version}`);
}

if (module.hot) {
  module.hot.accept('../../package.json', () => {});
}

ReactDOM.render(<Root />, document.getElementById('app'));
