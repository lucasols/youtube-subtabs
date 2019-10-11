import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from 'subTabs/Root';
import { version, name } from '../../package.json';

if (__PROD__) {
  console.log(`${name} v${version}`);
}

function injectSubTab() {
  const parent = document.getElementById('dismissable');

  if (parent) {
    if (!document.getElementById('youtube-subtabs')) {
      const subTabsRoot = document.createElement('div');
      subTabsRoot.id = 'youtube-subtabs';
      subTabsRoot.style.height = '28px';
      subTabsRoot.style.marginTop = '24px';
      parent.insertBefore(subTabsRoot, parent.firstChild);
    }
  } else {
    alert('parent element not exists');
    return;
  }

  ReactDOM.render(<Root />, document.getElementById('app'));
}

// document.addEventListener('DOMContentLoaded', injectSubTab);
injectSubTab();
