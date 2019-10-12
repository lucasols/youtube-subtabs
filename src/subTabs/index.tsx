import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from 'subTabs/Root';
import { version, name } from '../../package.json';

if (__PROD__) {
  console.log(`${name} v${version}`);
}

if (__DEV__) {
  const title = document.querySelector('#title');
  if (title) title.innerHTML = `${title.innerHTML}-122`;
}

function injectSubTab() {
  const parent = document.querySelector('ytd-shelf-renderer > #dismissable');
  const subTabsRoot = document.createElement('div');
  subTabsRoot.id = 'youtube-subtabs';
  subTabsRoot.style.height = '28px';
  subTabsRoot.style.marginTop = '24px';

  if (parent) {
    if (!document.getElementById('youtube-subtabs')) {
      parent.insertBefore(subTabsRoot, parent.firstChild);
    }
  } else {
    alert('parent element not exists');
    return;
  }

  ReactDOM.render(<Root />, subTabsRoot);
}

// document.addEventListener('DOMContentLoaded', injectSubTab);
injectSubTab();
