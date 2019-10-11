import { ChromeStorage } from 'utils/chromeStorage';

export type Response<T = ChromeStorage> =
  | {
      type: 'allData' | 'tabs' | 'filters';
      value: T;
    }
  | 'error';

chrome.storage.onChanged.addListener(changes => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
      url: 'https://*.youtube.com/feed/subscriptions',
    },
    tabs => {
      if (tabs[0]?.id) {
        if (changes.tabs) {
          const resp: Response<ChromeStorage['tabs']> = {
            type: 'tabs',
            value: changes.tabs.newValue || [],
          };
          chrome.tabs.sendMessage(tabs[0].id, resp, () => {});
        } else if (changes.filters) {
          const resp: Response<ChromeStorage['filters']> = {
            type: 'filters',
            value: changes.filters.newValue || [],
          };
          chrome.tabs.sendMessage(tabs[0].id, resp, () => {});
        }
      }
    },
  );
});

chrome.runtime.onMessage.addListener(
  (msg: { type: 'load' }, sender, response) => {
    switch (msg.type) {
      case 'load':
        chrome.storage.local.get(
          ['tabs', 'filters'],
          (result: ChromeStorage) => {
            const resp: Response = {
              type: 'allData',
              value: result,
            };

            response(resp);
          },
        );
        break;

      default:
        response('error');
        break;
    }
  },
);
