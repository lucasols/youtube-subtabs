type Subscriber = {
  pageRegex: RegExp;
  function: () => any;
  watchForElement: string;
};

let oldHref = document.location.pathname;
const subscribers: Subscriber[] = [];

function runSubscriber(subscriber: Subscriber) {
  setTimeout(() => {
    const element = document.querySelector(
      subscriber.watchForElement,
    );

    if (element) {
      subscriber.function();
    } else {
      runSubscriber(subscriber);
    }
  }, 100);
}

export function initializeOnPageChangeListener() {
  const app = document.querySelector('title');
  const observer = new MutationObserver(mutations => {
    mutations.forEach(() => {
      if (oldHref !== document.location.pathname) {
        oldHref = document.location.pathname;

        subscribers.forEach(subscriber => {
          if (subscriber.pageRegex.test(oldHref)) {
            runSubscriber(subscriber);
          }
        });
      }
    });
  });

  const config = {
    childList: true,
  };

  if (app) observer.observe(app, config);
}

export function addPageChangeSubscriber(
  page: RegExp,
  watchForElement: string,
  subscriber: () => any,
) {
  subscribers.push({
    pageRegex: page,
    function: subscriber,
    watchForElement,
  });
}
