import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Root from 'subTabs/Root';
import { version, name } from '../../package.json';

if (__PROD__) {
  console.log(`${name} v${version}`);
}

function injectSubTab() {
  const parent = document.querySelector('ytd-shelf-renderer > #dismissable');

  if (parent) {
    const subTabsRoot =
      document.getElementById('youtube-subtabs') ??
      document.createElement('div');

    if (!document.getElementById('youtube-subtabs')) {
      subTabsRoot.id = 'youtube-subtabs';
      subTabsRoot.style.height = '28px';
      subTabsRoot.style.marginTop = '24px';
      parent.insertBefore(subTabsRoot, parent.firstChild);
    }

    ReactDOM.render(<Root />, subTabsRoot);
  }
}

injectSubTab();

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (
      mutation.attributeName === 'aria-selected' &&
      (mutation.target as HTMLElement).getAttribute('aria-selected') === 'true'
    ) {
      setTimeout(injectSubTab, 400);
    }
  });
});

function addObserver() {
  const subscriptionButton = document.querySelector('a[href="/feed/subscriptions"] paper-item');
  if (subscriptionButton) {
    observer.observe(subscriptionButton, {
      attributes: true,
      attributeFilter: ['aria-selected'],
    });
  } else {
    setTimeout(addObserver, 400);
  }
}

setTimeout(addObserver, 400);
