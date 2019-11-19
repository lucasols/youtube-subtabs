import filtersState from 'settingsApp/state/filtersState';
import { checkIfFieldsMatchesItem } from 'utils/search';
import { genericFunction } from 'typings/utils';
import { css } from 'emotion';
import { openSettingsModal } from 'subTabs/injectSettingsModal';
import { colorPrimary, colorSecondary, colorGreen } from 'settingsApp/style/theme';
import { circle } from 'settingsApp/style/helpers';
import { centerContent } from 'settingsApp/style/modifiers';

const buttonStyle = css`
  ${circle(36)};
  ${centerContent};
  position: relative;
  background: transparent;
  border: 0;
  cursor: pointer;
  margin-top: 1.5px;
  margin-right: 8px;

  &:focus {
    outline: 0;
  }

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    ${circle(32)};
    background: ${colorPrimary};
    opacity: 0.8;
    transition: 160ms;
  }

  .filters-number {
    position: absolute;
    top: -2px;
    right: -2px;
    ${circle(14)};
    font-size: 10px;
    font-weight: bold;
    line-height: 14px;
    text-align: center;
    color: ${colorGreen};
    background: ${colorSecondary};
  }

  svg {
    width: 20px;
    height: 20px;

    path {
      fill: #fff;
    }
  }

  &:hover::before {
    opacity: 1;
  }
`;

function createButton(id: string, innerHTML: string, parent: HTMLElement, onClick: (e: MouseEvent) => any) {
  const oldButton = document.getElementById(id);

  if (oldButton) {
    oldButton.innerHTML = innerHTML;
  } else {
    const button = document.createElement('button');
    button.className = buttonStyle;
    button.id = id;

    button.innerHTML = innerHTML;
    button.addEventListener('click', onClick);

    parent.insertBefore(button, parent.firstChild);
  }
}

export function injectChannelButtons() {
  const buttonsWrapper = document.querySelector<HTMLElement>(
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

  createButton(
    `editFiltersButton${userId}`,
    `
      <svg viewBox="0 0 24 24">
        <path fill="#000000" d="M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z" />
      </svg>
      <div class="filters-number">${userFilters.length}</div>
    `,
    buttonsWrapper,
    () => openSettingsModal(`search=(userName:${userName}) (userId:${userId})`),
  );

  createButton(
    `addFilterButton${userId}`,
    `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" aria-hidden="true" viewBox="0 0 32 32" style="will-change:transform"><path d="M17 15V7h-2v8H7v2h8v8h2v-8h8v-2h-8z"/></svg>
    `,
    buttonsWrapper,
    () => openSettingsModal(`filter=new&fields=${JSON.stringify({ userName, userId })}`),
  );
}
