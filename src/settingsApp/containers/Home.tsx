import styled from '@emotion/styled';
import React, { useState } from 'react';
import Button from 'settingsApp/components/Button';
import DragAndDropCardList from 'settingsApp/components/DragAndDropCardList';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import HeaderStyle, {
  HeaderContent,
  HeaderRight,
  HeaderLeft,
} from 'settingsApp/components/HeaderStyle';
import ExportImportMenu from 'settingsApp/containers/ExportImportMenu';
import appState from 'settingsApp/state/appState';
import filtersState from 'settingsApp/state/filtersState';
import tabsState, {
  addTab,
  ExclusiveTabProps,
  TabProps,
} from 'settingsApp/state/tabsState';
import { centerContent, fillContainer } from 'settingsApp/style/modifiers';
import { flatToNested, nestedToFlat } from 'utils/flatToNested';
import { checkIfTabIsInvalid } from 'utils/validation';
import HeaderButton from 'settingsApp/components/HeaderButton';
import Icon from 'settingsApp/components/Icon';

const Container = styled.div`
  ${fillContainer};
  ${centerContent};
  align-items: flex-start;
  overflow-y: auto;
`;

const Home = () => {
  const [items, setItems] = tabsState.useStore('tabs');
  const [filters] = filtersState.useStore('filters');
  const [collapse, setCollapse] = useState<'ALL' | 'NONE'>();

  const nestedItems = flatToNested<ExclusiveTabProps>(
    items.map(tab => ({
      ...tab,
      isInvalid: checkIfTabIsInvalid(tab, filters, items),
    })),
  );

  function updateItems(newItems: TabProps[]) {
    setItems(nestedToFlat(newItems));
  }

  function confirmChange(
    dragItem: TabProps,
    destinationParent: TabProps | null,
  ) {
    return !(
      (dragItem.id === 'all' && destinationParent !== null)
      || destinationParent?.id === 'all'
    );
  }

  function onClick(item: TabProps) {
    appState.setKey('editTab', item.id);
  }

  return (
    <Container>
      <ContentWrapper>
        <HeaderStyle>
          <HeaderContent>
            <strong>Youtube SubTabs</strong>
          </HeaderContent>
          <HeaderRight>
            <HeaderButton
              icon="search"
              onClick={() => appState.setKey('search', '')}
            />
          </HeaderRight>
        </HeaderStyle>

        <div css={[centerContent, { marginBottom: 12, zIndex: 1 }]}>
          <Button label="Add Tab" small onClick={() => addTab(null)} />
          <Button label="Expand" small onClick={() => setCollapse('NONE')} />
          <Button label="Collapse" small onClick={() => setCollapse('ALL')} />
          <ExportImportMenu />
        </div>

        <DragAndDropCardList<ExclusiveTabProps>
          items={nestedItems}
          setItems={updateItems}
          maxDepth={2}
          confirmChange={confirmChange}
          onClick={onClick}
          collapse={collapse}
        />
      </ContentWrapper>
    </Container>
  );
};

export default Home;
