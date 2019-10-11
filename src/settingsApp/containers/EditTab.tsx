/* eslint-disable */
import styled from '@emotion/styled';
import { rgba } from '@lucasols/utils';
import Button from 'settingsApp/components/Button';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import HeaderStyle from 'settingsApp/components/HeaderStyle';
import Icon from 'settingsApp/components/Icon';
import React, { useEffect, useRef, useState } from 'react';
import appState from 'settingsApp/state/appState';
import tabsState, { changeTabName, setTabProp, TabProps } from 'settingsApp/state/tabsState';
import { circle } from 'settingsApp/style/helpers';
import { centerContent, fillContainer, centerContentCollum } from 'settingsApp/style/modifiers';
import { colorBg, colorPrimary, colorSecondary } from 'settingsApp/style/theme';
import AutosizeInput from 'react-input-autosize';
import { css } from 'emotion';
import { debounce } from 'lodash-es';
import Switch from 'settingsApp/components/Switch';
import { PartialKey } from 'src/typings/utils';
import filtersState, { FilterProps, addFilter } from 'settingsApp/state/filtersState';
import CardList from 'settingsApp/components/CardList';
import { filterIsInvalid } from 'settingsApp/utils/validation';
// IDEA: edit parent on edit tab page

export const EditPageContainer = styled.div`
  ${fillContainer};
  ${centerContent};
  align-items: flex-start;
  background: ${colorBg};
  overflow-y: auto;
  transition: 160ms;
`;

const Row = styled.div`
  ${centerContent};
  width: 100%;
  margin-top: 24px;
  justify-content: space-between;

  h1 {
    font-weight: 300;
    font-size: 16px;
  }
`;

export const CloseButton = styled.button`
  ${centerContent};
  position: fixed;
  top: 16px;
  right: 16px;
  ${circle(32)};
  z-index: 20;

  &::before {
    content: '';
    z-index: -1;
    position: absolute;
    ${circle(32)};
    background: ${colorSecondary};
    opacity: 0;
    transition: 160ms;
  }

  &:hover::before {
    opacity: 0.6;
  }
`;

export const tabNameInputClassname = css`
  border-radius: 2px;
  border: 1px solid transparent;
  transition: border 160ms;
  background: transparent;
  color: #fff;

  &:hover {
    border: 1px solid ${rgba(colorPrimary, 0.5)};
  }

  &:focus {
    border: 1px solid ${colorPrimary};
    outline: none;
  }
`;

const IncludeChildFiltersSwitchContainer = styled.div`
  ${centerContent};
  font-weight: 300;
  cursor: pointer;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 200px;
  transition: 160ms;
  user-select: none;

  &:hover {
    background: ${colorSecondary};
  }
`;

const debouncedSetNewTabName = debounce((id: number, newName: string) => changeTabName(id, newName), 1000);

const EditTab = () => {
  const [editTab, setEditTab] = appState.useStore('editTab');
  const [tabs] = tabsState.useStore('tabs');
  const [allFilters] = filtersState.useStore('filters');
  const [tabName, setTabName] = useState('');

  const selectedTab = tabs.find((item: typeof tabs[0]) => item.id === editTab);
  const parentTab = tabs.find((item: typeof tabs[0]) => item.id === selectedTab?.parent);

  const tabFilters = allFilters.filter(item => item.tab === selectedTab?.id).map(item => ({
    ...item,
    isInvalid: filterIsInvalid(item) ? 'Filter is invalid' : undefined,
  }));

  const excludeFilters = tabFilters.filter(item => item.type === 'exclude');
  const includeFilters = tabFilters.filter(item => item.type === 'include');

  const show = editTab !== null && selectedTab;

  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedTab) return;

    const newName = e.target.value;

    if (selectedTab?.id && selectedTab.id !== 'all') {
      debouncedSetNewTabName(selectedTab?.id, newName);
    }
    setTabName(newName);
  }

  function toggleIncludeChildFilters() {
    if (!selectedTab) return;

    setTabProp(selectedTab.id, 'includeChildsFilter', !selectedTab.includeChildsFilter);
  }

  function onClick(item: FilterProps) {
    appState.setKey('editFilter', item.id);
  }

  function updateFilters(newItems: FilterProps[]) {
    filtersState.dispatch('updateFilters', newItems);
  }

  useEffect(() => {
    setTabName(selectedTab?.name ?? '');
  }, [editTab]);

  return (
    <EditPageContainer
      css={{
        visibility: show ? 'visible' : 'hidden',
        opacity: show ? 1 : 0,
        transform: `scale(${show ? 1 : 1.1})`,
      }}
    >
      <CloseButton onClick={() => setEditTab(null)}>
        <Icon name="close" />
      </CloseButton>
      <ContentWrapper>
        <HeaderStyle>
          {editTab !== 'all' && 'Tab · '}
          {parentTab && <><span>{parentTab?.name}</span> · </>}
          {editTab !== 'all' ? (
            <AutosizeInput
              type="text"
              inputClassName={tabNameInputClassname}
              onChange={onChangeName}
              placeholder="Tab Name"
              value={tabName}
            />
          ) : <strong>Global Filters (All)</strong>}
        </HeaderStyle>

        {editTab !== 'all' && !parentTab &&
          <Row css={{ marginTop: 0, justifyContent: 'center' }}>
            <IncludeChildFiltersSwitchContainer onClick={toggleIncludeChildFilters}>
              Include child filters <Switch key={`${editTab}`} css={{ marginLeft: 8, marginBottom: -2 }} on={!!selectedTab?.includeChildsFilter} />
            </IncludeChildFiltersSwitchContainer>
          </Row>}

        <Row>
          <h1>+ Include Filters</h1>
          <Button label="Add" icon="add" small onClick={() => selectedTab && addFilter(selectedTab.id, 'include')} />
        </Row>
        <CardList
          items={includeFilters}
          setItems={updateFilters}
          maxDepth={1}
          onClick={onClick}
        />

        <Row>
          <h1> - Exclude Filters</h1>
          <Button label="Add" icon="add" small onClick={() => selectedTab && addFilter(selectedTab.id, 'exclude')} />
        </Row>
        <CardList
          items={excludeFilters}
          setItems={updateFilters}
          maxDepth={1}
          onClick={onClick}
        />

        {selectedTab?.id !== 'all' && <Row
          css={{
            marginTop: 40,
            paddingBottom: 24,
            position: 'sticky',
            bottom: 0,
          }}
        >
          <Button label="Delete" small css={{ marginLeft: 'auto' }} onClick={() => {
            if (selectedTab?.id && selectedTab?.id !== 'all') {
              appState.setKey('tabToDelete', selectedTab.id);
            }
          }} />
        </Row>}
      </ContentWrapper>
    </EditPageContainer>
  );
};

export default EditTab;
