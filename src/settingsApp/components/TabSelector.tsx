import React, { useState } from 'react';
import styled from '@emotion/styled';
import { rgba } from '@lucasols/utils/dist/rgba';
import { colorPrimary, fontSecondary, colorBg } from 'settingsApp/style/theme';
import { FilterProps } from 'settingsApp/state/filtersState';
import tabsState, { TabProps } from 'settingsApp/state/tabsState';
import { centerContent } from 'settingsApp/style/modifiers';
import Modal from 'settingsApp/components/Modal';
import { flatToNested } from 'utils/flatToNested';

type Props = {
  selectedTabsId?: FilterProps['tabs'];
  onChange: (selected: Props['selectedTabsId']) => void;
};

const Container = styled.div`
  position: relative;
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  min-height: 40px;
  font-family: ${fontSecondary};
  padding: 6px 4px 4px;
  border-radius: 8px;
  border: 1.5px solid ${rgba(colorPrimary, 0.7)};
  cursor: pointer;
  transition: 160ms;

  &:hover {
    border-color: ${colorPrimary};
  }
`;

const Label = styled.div`
  position: absolute;
  font-size: 14px;
  top: -10px;
  left: 10px;
  padding: 0 6px;
  background: ${colorBg};
`;

const SelectedTab = styled.div`
  font-size: 12px;
  height: 22px;
  ${centerContent};
  background: ${colorPrimary};
  border-radius: 4px;
  margin: 4px;
  flex-shrink: 0;
  padding: 0 8px;
`;

const TabsModal = styled(Modal)`
  top: auto;
  display: flex;
  flex-direction: column;
`;

const Tab = styled.div<{ selected: boolean }>`
  border-radius: 8px;
  border: 1.5px solid ${rgba(colorPrimary, 0.7)};
  cursor: pointer;
  padding: 6px 8px;
  margin: 4px 0;
  transition: 160ms;
  background: ${p => p.selected && colorPrimary};

  &:hover {
    border-color: ${colorPrimary};
  }
`;

const TabSelector = ({ selectedTabsId, onChange }: Props) => {
  const [tabs] = tabsState.useStore('tabs');
  const [showModal, setShowModal] = useState(false);
  const nestedTabs = flatToNested(tabs);

  if (!selectedTabsId) return null;

  const selectedTabs = tabs.filter(item => selectedTabsId.includes(item.id));

  function onTabClick(tabId: TabProps['id']) {
    if (!selectedTabsId) return;

    const selected = selectedTabsId.includes(tabId);
    onChange(
      selected
        ? selectedTabsId.filter(tab => tab !== tabId)
        : [...selectedTabsId, tabId],
    );
  }

  return (
    <>
      <Container
        onClick={() => setShowModal(true)}
      >
        <Label>Tabs</Label>
        {selectedTabs.map(tab => (
          <SelectedTab key={tab.id}>
            <span>{tab.name}</span>
          </SelectedTab>
        ))}
      </Container>
      <TabsModal
        title="Select Tabs"
        show={showModal}
        maxWidth={400}
        onClose={() => setShowModal(false)}
      >
        {nestedTabs.map(tab => (
          <React.Fragment key={tab.id}>
            <Tab
              selected={selectedTabsId.includes(tab.id)}
              onClick={() => onTabClick(tab.id)}
            >
              {tab.name}
            </Tab>
            {tab.children.map(childTab => (
              <Tab
                onClick={() => onTabClick(childTab.id)}
                css={{ marginLeft: 16 }}
                key={childTab.id}
                selected={selectedTabsId.includes(childTab.id)}
              >
                {childTab.name}
              </Tab>
            ))}
          </React.Fragment>
        ))}
      </TabsModal>
    </>
  );
};

export default TabSelector;
