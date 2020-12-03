/* eslint-disable */
import styled from '@emotion/styled';
import { rgba } from '@lucasols/utils';
import Button from 'settingsApp/components/Button';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import HeaderStyle, {
  HeaderLeft,
  HeaderContent,
  HeaderRight,
} from 'settingsApp/components/HeaderStyle';
import Icon from 'settingsApp/components/Icon';
import React, { useEffect, useRef, useState } from 'react';
import appState from 'settingsApp/state/appState';
import tabsState, {
  changeTabName,
  setTabProp,
  TabProps,
} from 'settingsApp/state/tabsState';
import {
  centerContent,
  fillContainer,
  centerContentCollum,
} from 'settingsApp/style/modifiers';
import { colorBg, colorPrimary, colorSecondary } from 'settingsApp/style/theme';
import AutosizeInput from 'react-input-autosize';
import { css } from '@emotion/react';
import { debounce } from 'lodash-es';
import Switch from 'settingsApp/components/Switch';
import { PartialKey } from 'src/typings/utils';
import filtersState, {
  FilterProps,
  addFilter,
} from 'settingsApp/state/filtersState';
import { filterIsInvalid } from 'utils/validation';
import HeaderButton from 'settingsApp/components/HeaderButton';
import FiltersList from 'settingsApp/components/FilterList';

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

export const tabNameInputClassname = css`
  border-radius: 2px;
  border: 1px solid transparent;
  transition: border 160ms;
  background: transparent;
  color: #fff;
  margin-left: 4px;

  &:hover {
    border: 1px solid ${rgba(colorPrimary, 0.5)};
  }

  &:focus {
    border: 1px solid ${colorPrimary};
    outline: none;
  }

  &::placeholder {
    color: #666;
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

const debouncedSetNewTabName = debounce(
  (id: number | 'all', newName: string) => changeTabName(id, newName),
  1000,
);

const EditTab = () => {
  const [editTab, setEditTab] = appState.useStore('editTab');
  const [tabs] = tabsState.useStore('tabs');
  const [allFilters] = filtersState.useStore('filters');
  const [tabName, setTabName] = useState('');

  const selectedTab = tabs.find((item: typeof tabs[0]) => item.id === editTab);
  const parentTab = tabs.find(
    (item: typeof tabs[0]) => item.id === selectedTab?.parent,
  );

  const tabFilters = allFilters
    .filter(item => selectedTab && item.tabs.includes(selectedTab.id))
    .map(item => ({
      ...item,
      isInvalid: filterIsInvalid(item) ? 'Filter is invalid' : undefined,
    }));

  const excludeFilters = tabFilters.filter(item => item.type === 'exclude');
  const includeFilters = tabFilters.filter(item => item.type === 'include');

  const show = editTab !== null && selectedTab;

  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    if (!selectedTab) return;

    const newName = e.target.value;

    if (selectedTab?.id) {
      debouncedSetNewTabName(selectedTab?.id, newName);
    }
    setTabName(newName);
  }

  function toggleIncludeChildFilters() {
    if (!selectedTab) return;

    setTabProp(
      selectedTab.id,
      'includeChildsFilter',
      !selectedTab.includeChildsFilter,
    );
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
      <ContentWrapper>
        <HeaderStyle>
          <HeaderLeft>
            <HeaderButton
              onClick={() => setEditTab(null)}
              icon="chevron-left"
            />
          </HeaderLeft>
          <HeaderRight>
            <HeaderButton
              icon="search"
              onClick={() =>
                appState.setKey('search', `(tabs:${selectedTab?.id})`)
              }
            />
          </HeaderRight>
          <HeaderContent>
            <span>
              {editTab !== 'all' ? 'Tab · ' : 'Global Filters · '}
              {parentTab && (
                <>
                  <span>{parentTab?.name}</span> ·{' '}
                </>
              )}
            </span>
            <AutosizeInput
              type="text"
              inputClassName={tabNameInputClassname}
              onChange={onChangeName}
              placeholder="Tab Name"
              value={tabName}
            />
          </HeaderContent>
        </HeaderStyle>

        {editTab !== 'all' && !parentTab && (
          <Row css={{ marginTop: 0, justifyContent: 'center' }}>
            <IncludeChildFiltersSwitchContainer
              onClick={toggleIncludeChildFilters}
            >
              Include child filters{' '}
              <Switch
                key={`${editTab}`}
                css={{ marginLeft: 8, marginBottom: -2 }}
                on={!!selectedTab?.includeChildsFilter}
              />
            </IncludeChildFiltersSwitchContainer>
          </Row>
        )}

        <Row>
          <h1>+ Include Filters</h1>
          <Button
            label="Add"
            icon="add"
            small
            onClick={() =>
              selectedTab &&
              addFilter({ tabs: [selectedTab.id], type: 'include' })
            }
          />
        </Row>
        <FiltersList items={includeFilters} />

        <Row>
          <h1> - Exclude Filters</h1>
          <Button
            label="Add"
            icon="add"
            small
            onClick={() =>
              selectedTab &&
              addFilter({ tabs: [selectedTab.id], type: 'exclude' })
            }
          />
        </Row>
        <FiltersList items={excludeFilters} />

        {selectedTab?.id !== 'all' && (
          <Row
            css={{
              marginTop: 40,
              paddingBottom: 24,
            }}
          >
            <Button
              label="Delete"
              small
              css={{ marginLeft: 'auto' }}
              onClick={() => {
                if (selectedTab?.id && selectedTab?.id !== 'all') {
                  appState.setKey('tabToDelete', selectedTab.id);
                }
              }}
            />
          </Row>
        )}
      </ContentWrapper>
    </EditPageContainer>
  );
};

export default EditTab;
