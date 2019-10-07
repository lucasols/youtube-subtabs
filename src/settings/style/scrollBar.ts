import { css } from '@emotion/core';
import { rgba } from '@lucasols/utils';
import { lighten } from 'polished';
import { colorPrimary } from 'style/theme';

const background = '#eee';
const thumb = colorPrimary;

export default css`
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background-color: ${background};
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${rgba(thumb, 0.5)};
    &:hover {
      background-color: ${rgba(thumb, 0.7)};
    }
    &:active {
      background-color: ${rgba(thumb, 0.9)};
    }
  }

  ::-webkit-scrollbar-corner {
    background-color: ${background};
  }
`;
