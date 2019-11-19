type Subscriber = {
  pageRegex: RegExp;
  function: () => any;
};

let oldHref = document.location.pathname;
const subscribers: Subscriber[] = [];

export function initializeOnPageChangeListener() {
  const app = document.querySelector('title');
  const observer = new MutationObserver(mutations => {
    mutations.forEach(() => {
      if (oldHref !== document.location.pathname) {
        oldHref = document.location.pathname;

        setTimeout(() => {
          subscribers.forEach(subscriber => {
            if (subscriber.pageRegex.test(oldHref)) {
              subscriber.function();
            }
          });
        }, 50);
      }
    });
  });

  const config = {
    childList: true,
  };

  if (app) observer.observe(app, config);
}

export function addPageChangeSubscriber(page: RegExp, subscriber: () => any) {
  subscribers.push({
    pageRegex: page,
    function: subscriber,
  });
}
