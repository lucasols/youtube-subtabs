import styled from '@emotion/styled';
import Button from 'components/Button';
import { ContentWrapper } from 'components/ContentWrapper';
import HeaderStyle from 'components/HeaderStyle';
import Icon from 'components/Icon';
import { debounce } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import AutosizeInput from 'react-input-autosize';
import { PartialKey } from 'src/typings/utils';
import appState from 'state/appState';
import tabsState, { changeTabName } from 'state/tabsState';
import { centerContent } from 'style/modifiers';
import { ListItem } from 'utils/flatToNested';
import { EditPageContainer, CloseButton, tabNameInputClassname } from 'containers/EditTab';

// TODO: add filter
// TODO: add tab
// TODO: add subtab
// TODO: change filter position
// IDEA: edit parent on edit tab page

const Row = styled.div`
  ${centerContent};
  width: 100%;
  margin-top: 24px;
  justify-content: space-between;
`;

const debouncedSetNewTabName = debounce((id: number, newName: string) => changeTabName(id, newName), 1000);

const EditFilter = () => {
  const [editFilter, setEditTab] = appState.useStore('editFilter');
  const [tabs] = tabsState.useStore('tabs');
  const [newTabProps, setNewTabProps] = useState<Omit<ListItem, 'id' | 'name'>>();

  const selectedTab = tabs.find((item: typeof tabs[0]) => item.id === editFilter);
  const parentTab = tabs.find((item: typeof tabs[0]) => item.id === selectedTab?.parent);
  const tabProps: PartialKey<ListItem, 'id' | 'name'> | undefined = selectedTab || newTabProps;

  // const show = editFilter !== null || editFilter === 'new';
  const show = true;

  const [tabName, setTabName] = useState();
  function onChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    if (!tabProps) return;

    const newName = e.target.value;

    if (selectedTab?.id && selectedTab.id !== 'all') {
      debouncedSetNewTabName(selectedTab?.id, newName);
    }
    setTabName(newName);
  }

  function checkIfIsValid() {
    if (tabName === '') return false;

    // if (parentTab && )
    // TODO: Check if there are filters
  }

  useEffect(() => {
    setTabName(editFilter === 'new' ? '' : selectedTab?.name);
  }, [editFilter]);

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
          {editFilter !== 'all' && editFilter === 'new' ? 'New Tab · ' : 'Edit Tab · '}
          {parentTab && <><span>{parentTab?.name}</span> · </>}
          {editFilter !== 'all' ? (
            <AutosizeInput
              type="text"
              inputClassName={tabNameInputClassname}
              onChange={onChangeName}
              placeholder="Tab Name"
              value={tabName}
            />
          ) : <strong>Global Filters (All)</strong>}
        </HeaderStyle>


        {editFilter === 'new' &&
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

export default EditFilter;
