import { css } from 'emotion';
import { fillContainer } from 'settingsApp/style/modifiers';
import { rgba } from '@lucasols/utils';
import { colorBg } from 'settingsApp/style/theme';

const style = css`
  position: fixed;
  height: calc(100% - 32px * 2);
  min-height: 600px;
  width: 400px;
  padding: 0;
  border: 0;
  background: transparent;

  &::backdrop {
    background-color: ${rgba(colorBg, 0.9)};
    backdrop-filter: blur(10px);
  }

  .iframe-wrapper {
    background: transparent;
    position: relative;
    height: 100%;
    width: 100%;
    overflow: hidden;
    border-radius: 12px;
    box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.05);
  }

  iframe {
    height: 100%;
    width: 100%;
  }
`;

export function injectModals() {
  const modal = document.createElement('dialog');
  modal.className = style;
  modal.innerHTML = `
    <div class="iframe-wrapper">
      <iframe id="settingsModal" allowtransparency="true"></iframe>
    </div>
    <button>
      <svg viewBox="0 0 32 32">
        <path d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4L14.6 16L8 22.6L9.4 24L16 17.4L22.6 24L24 22.6L17.4 16L24 9.4Z"></path>
      </svg>
    </button>
  `;
  document.body.appendChild(modal);
  modal.showModal();

  // eslint-disable-next-line no-unused-expressions
  modal.querySelector('button')?.addEventListener('click', () => {
    modal.close();
  });

  const iframe = modal.querySelector('iframe');
  if (iframe) {
    iframe.src = chrome.extension.getURL('index.html');
    iframe.frameBorder = '0';
  }
}
