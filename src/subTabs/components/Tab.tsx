import styled from '@emotion/styled';
import { rgba } from '@lucasols/utils';
import React from 'react';
import { TabProps } from 'settingsApp/state/tabsState';
import { colorYoutubePrimary, colorYoutubeBg } from 'subTabs/theme';
import { css } from '@emotion/core';
import {
  centerContent,
  hide,
  show,
  centerContentCollum,
} from 'settingsApp/style/modifiers';
import Icon from 'settingsApp/components/Icon';
import { ellipsis } from 'polished';

type Props = {
  data: TabProps;
  activeTab?: TabProps;
  parentIsInteractive: boolean;
  setActiveTab: (tab?: TabProps) => void;
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
  pointer-events: none;

  &:focus {
    outline: none;
    border-color: ${rgba(colorYoutubePrimary, 0.4)};
  }

  &:hover {
    border-color: ${rgba(colorYoutubePrimary, 0.4)};
  }
`;

const DropDown = styled.div`
  ${centerContentCollum};
  position: absolute;
  background: #282828;
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
  cursor: normal;

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

const activeChildStyle = css`
  color: ${colorYoutubePrimary};
`;

const Tab = ({ data, activeTab, setActiveTab, parentIsInteractive }: Props) => {
  const hasChilds = data.children && data.children.length > 0;

  const isActive = activeTab?.id === data.id || activeTab?.parent === data.id;

  function onTabClick(tab: TabProps) {
    if (activeTab?.id !== tab.id) {
      setActiveTab(tab);
    }
  }

  return (
    <Container>
      <ParentButton
        css={[isActive && activeTabStyle, parentIsInteractive && {
          pointerEvents: 'auto',
        }]}
        onClick={() => onTabClick(data)}
      >
        <span>{data.name}</span>
        {activeTab?.parent === data.id && <span css={ellipsis(70)}>: {activeTab?.name}</span>}
        {hasChilds && (
          <Icon
            name="chevron-down"
            size={16}
            color="#fff"
            css={{ marginRight: -6 }}
          />
        )}
      </ParentButton>
      {data.children && hasChilds && (
        <DropDown>
          {data.children.map(child => (
            <Child key={child.id} css={activeTab?.id === child.id && activeChildStyle} onClick={() => onTabClick(child)}>
              {child.name}
            </Child>
          ))}
        </DropDown>
      )}
    </Container>
  );
};

export default Tab;
