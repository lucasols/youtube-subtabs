import filtersState from 'settingsApp/state/filtersState';
import { checkIfFieldsMatchesItem } from 'utils/search';
import { genericFunction } from 'typings/utils';
import { css } from 'emotion';

const buttonStyle = css``;

function createButton(innerHTML: string, onClick: (e: MouseEvent) => any) {
  const button = document.createElement('button');
  button.className = buttonStyle;

  button.innerHTML = innerHTML;
  button.addEventListener('click', onClick);

  return button;
}

export function injectChannelButtons() {
  const buttonsWrapper = document.querySelector(
    '#buttons.ytd-c4-tabbed-header-renderer',
  );

  if (!buttonsWrapper) return;

  const userName = document.querySelector<HTMLElement>(
    '#channel-header yt-formatted-string.ytd-channel-name',
  )?.innerText;
  const userSearchUrl = document.querySelector<HTMLFormElement>(
    'form#form.ytd-expandable-tab-renderer',
  )?.action;

  if (!userSearchUrl || !userName) return;

  const { 1: userId } = /(?:user|channel)\/(.+?)\/search/.exec(
    userSearchUrl,
  ) || [undefined];

  if (!userId) return;

  const { filters } = filtersState.getState();

  const userFilters = filters
    .map(item => ({
      ...item,
      ...checkIfFieldsMatchesItem(
        {
          userId,
          userName,
        },
        item,
      ),
    }))
    .filter(item => item.matches);

  const editFiltersButton = createButton(
    `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" aria-hidden="true" viewBox="0 0 32 32" style="will-change:transform"><path d="M18 28h-4a2 2 0 0 1-2-2v-7.59L4.59 11A2 2 0 0 1 4 9.59V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v3.59a2 2 0 0 1-.59 1.41L20 18.41V26a2 2 0 0 1-2 2zM6 6v3.59l8 8V26h4v-8.41l8-8V6z"/></svg>
      <div>${userFilters.length}</div>
    `,
    () => {
      openSettingsModal('search=()')
    },
  );
}
