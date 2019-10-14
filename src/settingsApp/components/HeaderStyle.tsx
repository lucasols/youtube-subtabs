import React from 'react';
import styled from '@emotion/styled';
import { fontSecondary, fontCondensed } from 'settingsApp/style/theme';

const HeaderStyle = styled.div`
  margin-top: 26px;
  margin-bottom: 16px;
  font-size: 18px;
  font-family: ${fontCondensed};
  font-weight: 300;
  color: #ddd;
  text-align: center;

  span {
    text-transform: capitalize;
  }

  strong {
    font-weight: 400;
    color: #fff;
  }
`;

export default HeaderStyle;
