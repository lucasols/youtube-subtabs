import Root from 'subTabs/Root';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { css } from 'emotion';
import { getActiveFilters, checkVideoElem } from 'utils/filterVideos';
import tabsState from 'settingsApp/state/tabsState';
import filtersState, { getFilterById } from 'settingsApp/state/filtersState';
import { activeTabState } from 'subTabs/containers/SubTabs';
import { getFilterName } from 'utils/getFilterName';
import { openSettingsModal } from 'subTabs/injectSettingsModal';
import {
  colorPrimary,
  colorGreen,
  colorSecondary,
  colorBg,
} from 'settingsApp/style/theme';
import { rgba } from '@lucasols/utils';
import { ellipsis } from 'polished';
import { checkIfFieldsMatchesItem } from 'utils/search';

const subTabsInfoContainerStyle = css`
  width: 100%;
  background: ${colorBg};
  margin-bottom: -8px;
  margin-top: 8px;
  padding: 12px;
  max-width: 220px;
  box-sizing: border-box;
  border-top: 1px solid var(--yt-spec-10-percent-layer);

  .block {
    margin-bottom: 14px;
    width: 100%;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  button {
    width: 100%;
    background: ${rgba(colorPrimary, 0.8)};
    border: 0;
    border-radius: 20px;
    color: #fff;
    padding: 6px 8px;
    font-size: 10px;
    text-transform: uppercase;
    cursor: pointer;
    transition: 160ms;
    height: 24px;
    ${ellipsis()};
    letter-spacing: 0.08em;
    margin-bottom: 6px;

    &:hover {
      background: ${colorPrimary};
    }

    &:last-of-type {
      margin-bottom: 0;
    }

    &.filter {
      border-radius: 4px;
      text-transform: none;
      background: ${rgba(colorSecondary, 0.8)};

      &:hover {
        background: ${colorSecondary};
      }
    }
  }

  h1 {
    font-size: 10px;
    font-weight: 400;
    margin-bottom: 6px;
    letter-spacing: 0.04em;
  }

  .field {
    letter-spacing: 0.08em;
    display: inline-block;
    background: ${colorGreen};
    border-radius: 4px;
    padding: 3px 5px;
    margin-right: 4px;
    font-size: 10px;
  }
`;

function injectDropdownInfo(e: MouseEvent) {
  const menuButton = e.target as HTMLElement;
  const videoElements =
    'ytd-grid-video-renderer, ytd-video-renderer, ytd-rich-item-renderer, #primary-inner.ytd-watch-flexy';

  if (
    menuButton.matches(
      `:-webkit-any(${videoElements}) yt-icon.ytd-menu-renderer`,
    )
  ) {
    const dropDownList = document.querySelector<HTMLElement>(
      'iron-dropdown paper-listbox#items',
    );

    if (!dropDownList) return;

    // #region hide video button
    const buttons = dropDownList.querySelectorAll<HTMLElement>(
      ':scope > ytd-menu-service-item-renderer',
    );
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];

      if (button.innerText.trim() === 'Hide') {
        buttons[i - 1].removeAttribute('has-separator_');
        button.style.display = 'none';
        break;
      }
    }
    // #endregion

    let subTabsInfoContainer = document.getElementById('subTabsInfoContainer');

    if (!subTabsInfoContainer) {
      subTabsInfoContainer = document.createElement('div');
      subTabsInfoContainer.id = 'subTabsInfoContainer';
      subTabsInfoContainer.className = subTabsInfoContainerStyle;
      dropDownList.append(subTabsInfoContainer);
    }

    const activeTab =
      /feed\/subscriptions/.test(window.location.pathname) &&
      activeTabState.getState().id;
    const videoElement = menuButton.closest<HTMLElement>(videoElements);

    const { filters } = filtersState.getState();

    const activeFilters = activeTab
      ? getActiveFilters(activeTab, tabsState.getState().tabs, filters)
      : false;

    const videoProps = videoElement
      ? checkVideoElem(
        videoElement,
        activeFilters ? activeFilters.includeFilters : [],
        activeFilters ? activeFilters.excludeFilters : [],
      )
      : undefined;

    const includeBasedOnFilter =
      videoProps && videoProps.includeBasedOnFilter
        ? getFilterById(videoProps.includeBasedOnFilter)
        : undefined;

    const filterName = includeBasedOnFilter
      ? getFilterName(includeBasedOnFilter)
      : undefined;

    if (!videoProps) {
      console.log('Fail to get video props');
      return;
    }

    const userFilters = filters
      .map(item => ({
        ...item,
        ...checkIfFieldsMatchesItem(
          {
            userId: videoProps.userId,
            userName: videoProps.userName,
          },
          item,
        ),
      }))
      .filter(item => item.matches);

    ReactDOM.render(
      <>
        {includeBasedOnFilter && (
          <div className="block">
            <h1>Included by filter:</h1>
            <button
              type="button"
              className="filter"
              onClick={() =>
                openSettingsModal({ filter: `${includeBasedOnFilter.id}` })}
              title={filterName}
            >
              {filterName}
            </button>
          </div>
        )}
        {videoProps && videoProps.includeBasedOnFields.length > 0 && (
          <div className="block">
            <h1>Included based on:</h1>
            {videoProps.includeBasedOnFields.map((field, i) => (
              <span key={i} className="field">
                {field}
              </span>
            ))}
          </div>
        )}
        <div className="block">
          <button
            onClick={() => {
              openSettingsModal({
                search: `(userName:${videoProps.userName}) (userId:${videoProps.userId}) (videoName:${videoProps.videoName})`,
              });
            }}
            type="button"
          >
            Show video filters
          </button>
          <button
            onClick={() => {
              openSettingsModal({
                search: `(userName:${videoProps.userName}) (userId:${videoProps.userId})`,
              });
            }}
            type="button"
          >
            Show channel filters ({userFilters.length})
          </button>
          <button
            onClick={() => {
              openSettingsModal({
                filter: 'new',
                fields: JSON.stringify({
                  userName: videoProps.userName,
                  userId: videoProps.userId,
                  videoNameRegex: videoProps.videoName,
                }),
              });
            }}
            type="button"
          >
            Add filter
          </button>
        </div>
      </>,
      subTabsInfoContainer,
    );
  }
}

document.body.addEventListener('click', injectDropdownInfo);
