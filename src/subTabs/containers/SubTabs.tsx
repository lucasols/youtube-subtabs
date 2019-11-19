import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { clampMax, clampMin, rgba } from '@lucasols/utils';
import { debounce } from 'lodash-es';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'settingsApp/components/Icon';
import filtersState from 'settingsApp/state/filtersState';
import tabsState, { TabProps } from 'settingsApp/state/tabsState';
import { centerContent, hide, show } from 'settingsApp/style/modifiers';
import Tab from 'subTabs/components/Tab';
import { colorYoutubeBg, colorYoutubePrimary } from 'subTabs/theme';
import { filterVideos } from 'utils/filterVideos';
import { flatToNested } from 'utils/flatToNested';

const FixedContainer = styled.div`
  position: fixed;
  z-index: 1000;
  top: 56px;
  width: 0;

  * {
    box-sizing: border-box;
  }
`;

const Container = styled.div`
  width: 100%;
  color: #fff;
  padding-top: 24px;
  padding-bottom: 20px;
  background: ${colorYoutubeBg};
  overflow: hidden;
`;

const TabsWrapper = styled.div`
  white-space: nowrap;
  width: max-content;
  transition: 160ms;
`;

const ScrollButtonRight = styled.button`
  ${hide};
  ${centerContent};
  position: absolute;
  right: 0;
  padding: 0;
  top: 24px;
  height: 28px;
  cursor: pointer;
  border: 0;
  width: 28px;
  transform: rotate(-90deg);
  background: linear-gradient(
    0deg,
    ${colorYoutubeBg} 60%,
    ${rgba(colorYoutubeBg, 0)} 100%
  );
  transition: 160ms;
`;

const ScrollButtonLeft = styled(ScrollButtonRight)`
  left: 0;
  right: auto;
  transform: rotate(90deg);
`;

const scrollButtonVisible = css`
  ${show};
`;

function getActiveTabFromUrl(tabs: TabProps[]) {
  const { 1: name, 2: id }: (string | undefined)[] =
    /#subTab=(.+)-(\d+|all)/.exec(window.location.hash) || [];

  if (id === 'all') return id;

  const activeTab = tabs.find(tab => tab.name === name?.replace(/_/g, ' '));

  if (activeTab) {
    return activeTab.id;
  }

  return id && !Number.isNaN(+id) ? +id : false;
}

const debouncedFilterVideos = debounce(filterVideos, 500);

const App = () => {
  const [tabs] = tabsState.useStore('tabs');
  const [filters] = filtersState.useStore('filters');
  const [scrollX, setScrollX] = useState(0);
  const [tabWrapperWidth, setTabWrapperWidth] = useState(0);
  const [rootRect, setRootRect] = useState<DOMRect>();
  const tabsWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTabId, setActiveTabId] = useState<number | 'all' | false>(
    getActiveTabFromUrl(tabs),
  );
  const containerWidth = rootRect?.width || 0;

  const activeTab =
    tabs.find(tab => tab.id === activeTabId)
    || tabs[0];

  const parentTabs = flatToNested(tabs);

  useEffect(() => {
    if (activeTab?.id) {
      window.history.replaceState(
        '',
        '',
        `#subTab=${activeTab.name.replace(/ /g, '_')}-${activeTab.id}`,
      );
    }
  }, [activeTab?.id]);

  useEffect(() => {
    if (!activeTab?.id) return () => {};

    debouncedFilterVideos(activeTab.id, tabs, filters);

    const videoContainer = document.querySelector('ytd-section-list-renderer');

    const observeElemSizes = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === videoContainer) {
          debouncedFilterVideos(activeTab.id, tabs, filters);
        }
      });
    });

    if (videoContainer) observeElemSizes.observe(videoContainer);

    return () => observeElemSizes.disconnect();
  }, [activeTab?.id, tabs, filters]);

  useEffect(() => {
    const rootElem = document.getElementById('youtube-subtabs');

    const observeElemSizes = new ResizeObserver(entries => {
      entries.forEach(entry => {
        if (entry.target === rootElem) {
          setRootRect(entry.contentRect);
        } else if (entry.target === tabsWrapperRef.current) {
          setTabWrapperWidth(entry.contentRect.width);
        }
      });
    });

    if (rootElem) observeElemSizes.observe(rootElem);
    if (tabsWrapperRef.current) observeElemSizes.observe(tabsWrapperRef.current);

    return () => observeElemSizes.disconnect();
  }, []);

  function moveScroll(direction: 'left' | 'right') {
    const shift = containerWidth - 50;
    if (direction === 'right') {
      setScrollX(clampMax(scrollX + shift, tabWrapperWidth - containerWidth));
    } else {
      setScrollX(clampMin(scrollX - shift, 0));
    }
  }

  return (
    <FixedContainer
      css={{
        width: rootRect?.width,
        height: rootRect?.height,
      }}
    >
      <Container ref={containerRef}>
        <TabsWrapper
          ref={tabsWrapperRef}
          style={{
            marginLeft: -scrollX,
          }}
        >
          {parentTabs.map(tab => (
            <Tab
              key={tab.id}
              activeTab={activeTab}
              parentIsInteractive={
                tab.id === 'all'
                || filters.some(filter => filter.tabs.includes(tab.id))
                || (tab.includeChildsFilter && !!tab.children)
              }
              data={tab}
              setActiveTab={setActiveTabId}
            />
          ))}
        </TabsWrapper>
        <ScrollButtonRight
          css={
            tabWrapperWidth > containerWidth &&
            scrollX !== tabWrapperWidth - containerWidth &&
            scrollButtonVisible
          }
          onClick={() => moveScroll('right')}
        >
          <Icon name="chevron-down" size={28} color={colorYoutubePrimary} />
        </ScrollButtonRight>
        <ScrollButtonLeft
          onClick={() => moveScroll('left')}
          css={scrollX > 0 && scrollButtonVisible}
        >
          <Icon name="chevron-down" size={28} color={colorYoutubePrimary} />
        </ScrollButtonLeft>
      </Container>
    </FixedContainer>
  );
};

export default App;
