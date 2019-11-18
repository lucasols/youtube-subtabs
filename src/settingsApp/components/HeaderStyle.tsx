import styled from '@emotion/styled';
import { colorBg, fontCondensed } from 'settingsApp/style/theme';
import { centerContent } from 'settingsApp/style/modifiers';
import { css } from '@emotion/core';

const HeaderStyle = styled.div`
  top: 0;
  position: sticky;
  background: ${colorBg};
  padding-top: 26px;
  padding-bottom: 8px;
  margin-bottom: 8px;
  width: 100%;
  font-size: 18px;
  font-family: ${fontCondensed};
  font-weight: 300;
  color: #ddd;
  text-align: center;
  z-index: 2;
  box-shadow: 0 0 6px 4px ${colorBg};
  display: grid;
  grid-template-columns: 1fr max-content 1fr;
  grid-auto-flow: column;

  span {
    text-transform: capitalize;
  }

  strong {
    font-weight: 400;
    color: #fff;
  }
`;

export const HeaderContent = styled.div`
  ${centerContent};
  grid-column: 2;
`;

const headerSideBaseStyle = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, auto);
  position: relative;
  align-self: center;
  grid-auto-flow: column;
  column-gap: 4px;
`;

export const HeaderRight = styled.div`
  ${headerSideBaseStyle};
  grid-column: 3;
  justify-self: end;
`;

export const HeaderLeft = styled.div`
  ${headerSideBaseStyle};
  grid-column: 1;
  justify-self: start;
`;

export default HeaderStyle;
