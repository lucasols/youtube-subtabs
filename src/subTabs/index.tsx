import { injectModals } from 'subTabs/injectModals';
import { name, version } from '../../package.json';
import { injectSubTab } from './injectSubTab';

if (__PROD__) {
  console.log(`${name} v${version}`);
}

injectModals();
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
  const subscriptionButton = document.querySelector(
    'a[href="/feed/subscriptions"] paper-item',
  );
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
