import styled from '@emotion/styled';
import { rgba } from '@lucasols/utils';
import Button from 'components/Button';
import { ContentWrapper } from 'components/ContentWrapper';
import HeaderStyle from 'components/HeaderStyle';
import Icon from 'components/Icon';
import React, { useEffect, useRef, useState } from 'react';
import appState from 'state/appState';
import tabsState, { changeTabName, setTabProp } from 'state/tabsState';
import { circle } from 'style/helpers';
import { centerContent, fillContainer, centerContentCollum } from 'style/modifiers';
import { colorBg, colorPrimary, colorSecondary } from 'style/theme';
import AutosizeInput from 'react-input-autosize';
import { css } from 'emotion';
import { debounce } from 'lodash-es';
import Switch from 'components/Switch';
import { ListItem } from 'utils/flatToNested';
import { PartialKey } from 'src/typings/utils';

// TODO: add filter
// TODO: add tab
// TODO: add subtab
// TODO: change filter position
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
  const [newTabProps, setNewTabProps] = useState<Omit<ListItem, 'id' | 'name'>>();

  const selectedTab = tabs.find((item: typeof tabs[0]) => item.id === editTab);
  const parentTab = tabs.find((item: typeof tabs[0]) => item.id === selectedTab?.parent);
  const tabProps: PartialKey<ListItem, 'id' | 'name'> | undefined = selectedTab || newTabProps;

  const show = editTab !== null || editTab === 'new';

  const [tabName, setTabName] = useState();
  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    if (!tabProps) return;

    const newName = e.target.value;

    if (selectedTab?.id && selectedTab.id !== 'all') {
      debouncedSetNewTabName(selectedTab?.id, newName);
    }
    setTabName(newName);
  }

  function toggleIncludeChildFilters() {
    if (!tabProps) return;

    if (editTab === 'new' && newTabProps) {
      setNewTabProps({
        ...newTabProps,
        includeChildsFilter: !tabProps.includeChildsFilter,
      });
    } else if (tabProps.id) {
      setTabProp(tabProps.id, 'includeChildsFilter', !tabProps.includeChildsFilter);
    }
  }

  function checkIfIsValid() {
    if (tabName === '') return false;

    // if (parentTab && )
    // TODO: Check if there are filters
  }

  useEffect(() => {
    setTabName(editTab === 'new' ? '' : selectedTab?.name);
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
          {editTab !== 'all' && editTab === 'new' ? 'New Tab · ' : 'Edit Tab · '}
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

        {editTab !== 'all' && (!parentTab || editTab === 'new') &&
          <Row css={{ marginTop: 0, justifyContent: 'center' }}>
            <IncludeChildFiltersSwitchContainer onClick={toggleIncludeChildFilters}>
              Include child filters <Switch key={`${editTab}`} css={{ marginLeft: 8, marginBottom: -2 }} on={!!tabProps?.includeChildsFilter} />
            </IncludeChildFiltersSwitchContainer>
          </Row>}

        <Row>
          <h1>+ Include Filters</h1>
          <Button label="Add" icon="add" small />
        </Row>

        {/* <CardList
          items={nestedItems}
          setItems={updateItems}
          maxDepth={1}
          confirmChange={confirmChange}
          onClick={onClick}
        /> */}

        <Row>
          <h1> - Exclude Filters</h1>
          <Button label="Add" icon="add" small />
        </Row>

        {/* <CardList
          items={nestedItems}
          setItems={updateItems}
          maxDepth={1}
          confirmChange={confirmChange}
          onClick={onClick}
        /> */}
        {editTab === 'new' &&
          <Row
            css={{
              marginTop: 40,
              paddingBottom: 24,
              position: 'sticky',
              bottom: 0,
            }}
          >
            <Button label="Cancel" small css={{ marginLeft: 'auto' }} onClick={() => setEditTab(null)} />
            <Button label="Add tab" disabled={checkIfIsValid()} small onClick={undefined} />
          </Row>}
      </ContentWrapper>
    </EditPageContainer>
  );
};

export default EditTab;
