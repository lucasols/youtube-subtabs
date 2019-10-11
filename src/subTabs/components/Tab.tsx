import styled from '@emotion/styled';
import { rgba } from '@lucasols/utils';
import React from 'react';
import { TabProps } from 'settingsApp/state/tabsState';
import { colorYoutubePrimary, colorYoutubeBg } from 'subTabs/theme';
import { css } from '@emotion/core';
import { centerContent, hide, show, centerContentCollum } from 'settingsApp/style/modifiers';
import Icon from 'settingsApp/components/Icon';
import { ellipsis } from 'polished';

type Props = {
  data: TabProps;
  active: boolean;
};

const Container = styled.div`
  display: inline-block;
`;

const ParentButton = styled.button`
  ${centerContent};
  position: relative;
  background: transparent;
  display: inline-flex;
  color: #fff;
  border: 1.5px solid transparent;
  padding: 4px 14px;
  margin-right: 8px;
  font-size: 14px;
  height: 28px;
  transition: 160ms;
  border-radius: 200px;
  cursor: pointer;

  &:hover {
    border-color: ${rgba(colorYoutubePrimary, 0.4)};
  }
`;

const DropDown = styled.div`
  ${centerContentCollum};
  position: absolute;
  background: ${colorYoutubeBg};
  padding: 4px 0;
  border-radius: 4px;
  transition: 160ms;
  max-width: 180px;
  min-width: 120px;
  cursor: pointer;
  ${hide};

  ${Container}:hover & {
    ${show};
  }
`;

const activeTabStyle = css`
  border-color: ${colorYoutubePrimary};

  &:hover {
    border-color: ${colorYoutubePrimary};
  }
`;

const Child = styled.div`
  font-size: 14px;
  padding: 8px 12px;
  width: 100%;
  ${ellipsis()};

  &:hover {
    background: #222;
  }
`;

const Tab = ({ data, active }: Props) => {
  const hasChilds = data.children && data.children.length > 0;

  return (
    <Container>
      <ParentButton css={active && activeTabStyle}>
        <span>{data.name}</span>
        {hasChilds && <Icon name="chevron-down" size={16} color="#fff" css={{ marginRight: -4 }} />}
      </ParentButton>
      {data.children && hasChilds && <DropDown>
        {data.children.map(child => (
          <Child key={child.id}>
            {child.name}
          </Child>
        ))}
      </DropDown>}
    </Container>
  );
};

export default Tab;
