import Button from 'components/Button';
import CardList from 'components/CardList';
import { ContentWrapper } from 'components/ContentWrapper';
import HeaderStyle from 'components/HeaderStyle';
import { NestableItemBaseProps } from 'lib/react-nestable';
import React, { useState } from 'react';
import appState from 'state/appState';
import tabsState, { ExclusiveTabProps, TabProps, addTab } from 'state/tabsState';
import { flatToNested, nestedToFlat } from 'utils/flatToNested';

const Home = () => {
  const [items, setItems] = tabsState.useStore('tabs');
  const nestedItems = flatToNested<ExclusiveTabProps>(items);
  const [collapse, setCollapse] = useState<'ALL' | 'NONE'>();

  function updateItems(newItems: TabProps[]) {
    console.log(newItems);

    setItems(nestedToFlat(newItems));
  }

  function confirmChange(
    dragItem: TabProps,
    destinationParent: TabProps | null,
  ) {
    return !(dragItem.id === 'all' && destinationParent !== null);
  }

  function onClick(item: TabProps) {
    appState.setKey('editTab', item.id);
  }

  return (
    <ContentWrapper>
      <HeaderStyle>
        <strong>Youtube SubTabs</strong>
      </HeaderStyle>

      <div css={{ marginBottom: 12 }}>
        <Button
          label="Add Tab"
          small
          onClick={() => addTab(null)}
        />
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
  );
};

export default Home;
