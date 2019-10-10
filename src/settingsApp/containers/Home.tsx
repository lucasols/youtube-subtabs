import Button from 'settingsApp/components/Button';
import CardList from 'settingsApp/components/CardList';
import { ContentWrapper } from 'settingsApp/components/ContentWrapper';
import HeaderStyle from 'settingsApp/components/HeaderStyle';
import { NestableItemBaseProps } from 'settingsApp/lib/react-nestable';
import React, { useState } from 'react';
import appState from 'settingsApp/state/appState';
import tabsState, { ExclusiveTabProps, TabProps, addTab } from 'settingsApp/state/tabsState';
import { flatToNested, nestedToFlat } from 'settingsApp/utils/flatToNested';

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
