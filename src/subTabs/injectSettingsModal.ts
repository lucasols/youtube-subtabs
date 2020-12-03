import { rgba } from '@lucasols/utils';
import { css } from '@emotion/react';
import { colorBg, colorSecondary, colorPrimary } from 'settingsApp/style/theme';
import { centerContent } from 'settingsApp/style/modifiers';
import { circle } from 'settingsApp/style/helpers';
import { genericFunction, obj } from 'typings/utils';

const style = css`
  ${centerContent};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  background-color: ${rgba(colorSecondary, 0.9)};
  backdrop-filter: blur(10px);
  z-index: 1000000;
  visibility: hidden;
  opacity: 0;
  transition: opacity 240ms;

  &.show {
    visibility: visible;
    opacity: 1;
  }

  .iframe-wrapper {
    height: calc(100% - 32px * 2);
    min-height: 600px;
    width: 400px;
    background: transparent;
    position: relative;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 2px 12px 0 ${rgba(colorPrimary, 0.2)};
  }

  iframe {
    height: 100%;
    width: 100%;
  }

  button {
    ${circle(32)};
    ${centerContent};
    background: transparent;
    border: 0;
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;

    &:focus {
      outline: 0;
    }

    &::before {
      content: '';
      position: absolute;
      z-index: -1;
      ${circle(32)};
      background: ${colorPrimary};
      opacity: 0;
      transition: 160ms;
    }

    svg {
      width: 24px;
      height: 24px;

      path {
        fill: #fff;
      }
    }

    &:hover::before {
      opacity: 0.6;
    }
  }
`;

const settingsModalWrapper = document.createElement('div');

export function injectModals() {
  settingsModalWrapper.className = style;
  settingsModalWrapper.innerHTML = `
    <div class="iframe-wrapper">
      <iframe id="settingsModal" allowtransparency="true" frameborder="0"></iframe>
    </div>
    <button>
      <svg viewBox="0 0 32 32">
        <path d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4L14.6 16L8 22.6L9.4 24L16 17.4L22.6 24L24 22.6L17.4 16L24 9.4Z"></path>
      </svg>
    </button>
  `;
  document.body.appendChild(settingsModalWrapper);

  // eslint-disable-next-line no-unused-expressions
  settingsModalWrapper
    .querySelector('button')
    ?.addEventListener('click', () => {
      settingsModalWrapper.classList.remove('show');
    });
}

function showModal() {
  settingsModalWrapper.classList.add('show');
  const iframe = settingsModalWrapper.querySelector('iframe');
  if (iframe) {
    iframe.removeEventListener('load', showModal);
  }
}

export function openSettingsModal(params?: obj<string>) {
  const iframe = settingsModalWrapper.querySelector('iframe');
  if (iframe) {
    iframe.addEventListener('load', showModal);

    const url = new URLSearchParams();
    Object.entries(params || {}).forEach(([name, value]) => {
      url.append(name, value);
    });

    iframe.src = `${chrome.extension.getURL('index.html')}${
      params ? `?${url.toString()}` : ''
    }`;
  }
}

// setTimeout(() => openSettingsModal(), 500);
