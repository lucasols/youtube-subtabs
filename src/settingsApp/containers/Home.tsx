import Button from 'settingsApp/components/Button';
import CardList from 'settingsApp/components/CardList';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import HeaderStyle from 'settingsApp/components/HeaderStyle';
import { NestableItemBaseProps } from 'settingsApp/lib/react-nestable';
import React, { useState } from 'react';
import appState from 'settingsApp/state/appState';
import tabsState, {
  ExclusiveTabProps,
  TabProps,
  addTab,
} from 'settingsApp/state/tabsState';
import { flatToNested, nestedToFlat } from 'utils/flatToNested';
import styled from '@emotion/styled';
import { fillContainer, centerContent } from 'settingsApp/style/modifiers';
import { checkIfTabIsInvalid } from 'utils/validation';
import filtersState from 'settingsApp/state/filtersState';
import ExportImportMenu from 'settingsApp/containers/ExportImportMenu';

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

  const nestedItems = flatToNested<ExclusiveTabProps>(items.map(tab => ({
    ...tab,
    isInvalid: checkIfTabIsInvalid(tab, filters, items),
  })));

  function updateItems(newItems: TabProps[]) {
    console.log(newItems);

    setItems(nestedToFlat(newItems));
  }

  function confirmChange(
    dragItem: TabProps,
    destinationParent: TabProps | null,
  ) {
    return !((dragItem.id === 'all' && destinationParent !== null) || destinationParent?.id === 'all');
  }

  function onClick(item: TabProps) {
    appState.setKey('editTab', item.id);
  }

  return (
    <Container>
      <ContentWrapper>
        <HeaderStyle>
          <strong>Youtube SubTabs</strong>
        </HeaderStyle>

        <div css={{ marginBottom: 12 }}>
          <Button label="Add Tab" small onClick={() => addTab(null)} />
          <Button label="Expand" small onClick={() => setCollapse('NONE')} />
          <Button label="Collapse" small onClick={() => setCollapse('ALL')} />
        </div>

        <CardList<ExclusiveTabProps>
          items={nestedItems}
          setItems={updateItems}
          maxDepth={2}
          confirmChange={confirmChange}
          onClick={onClick}
          collapse={collapse}
        />
      </ContentWrapper>
      <ExportImportMenu />
    </Container>
  );
};

export default Home;
