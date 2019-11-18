import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from 'subTabs/Root';

export function injectSubTab() {
  const parent = document.querySelector('ytd-shelf-renderer > #dismissable');
  if (parent) {
    const subTabsRoot = document.getElementById('youtube-subtabs')
      ?? document.createElement('div');
    if (!document.getElementById('youtube-subtabs')) {
      subTabsRoot.id = 'youtube-subtabs';
      subTabsRoot.style.height = '28px';
      subTabsRoot.style.marginTop = '24px';
      parent.insertBefore(subTabsRoot, parent.firstChild);
    }
    ReactDOM.render(<Root />, subTabsRoot);
  }
}
