import styled from '@emotion/styled';
import React, { useState, useEffect, useRef } from 'react';
import filtersState, { FilterProps } from 'settingsApp/state/filtersState';
import tabsState, { TabProps } from 'settingsApp/state/tabsState';
import Tab from 'subTabs/components/Tab';
import { flatToNested } from 'settingsApp/utils/flatToNested';
import Icon from 'settingsApp/components/Icon';
import { centerContent, hide, show } from 'settingsApp/style/modifiers';
import { colorYoutubeBg } from 'subTabs/theme';
import { rgba, clampMin, clampMax } from '@lucasols/utils';
import { debounce } from 'lodash-es';
import { css } from '@emotion/core';

const FixedContainer = styled.div`
  position: fixed;
  z-index: 1000;
  width: 0;
`;

const Container = styled.div`
  width: 100%;
  color: #fff;
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
  top: 0;
  height: 28px;
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
  opacity: 0.6;

  &:hover {
    opacity: 1;
  }
`;

const App = () => {
  const [tabs, setTabs] = useState<TabProps[]>([]);
  const [filters, setFilters] = useState<FilterProps[]>([]);
  const [scrollX, setScrollX] = useState(0);
  const [tabWrapperWidth, setTabWrapperWidth] = useState(0);
  const [rootRect, setRootRect] = useState<DOMRect>();
  const tabsWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = rootRect?.width || 0;

  const parentTabs = tabs.filter(tab => {
    if (tab.parent !== null) return false;

    if (tab.id === 'all') return true;

    const tabFilters = filters.filter(filter => filter.tab === tab.id);

    if (tab.includeChildsFilter === false) {
      if (
        tabFilters.length === 0
        || tabFilters.every(filter => filter.videoNameRegex === '' && filter.userRegex === '')
      ) {
        return false;
      }
    } else if (
      tabFilters.length === 0
      || tabFilters.every(filter => filter.videoNameRegex === '' && filter.userRegex === '')
    ) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    if (module.hot) {
      setTabs(flatToNested(tabsState.getState().tabs));
      setFilters(filtersState.getState().filters);
    }

    setTimeout(() => {
      if (tabsWrapperRef.current) {
        setTabWrapperWidth(tabsWrapperRef.current.getBoundingClientRect().width);
      }
    }, 500);

    const observeRoot = new ResizeObserver(entries => {
      entries.forEach(entry => {
        setRootRect(entry.contentRect);
      });
    });

    const rootElem = document.getElementById('youtube-subtabs');

    if (rootElem) observeRoot.observe(rootElem);

    return () => observeRoot.disconnect();
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
        top: rootRect?.top,
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
            <Tab key={tab.id} active={tab.id === 1} data={tab} />
          ))}
        </TabsWrapper>
        <ScrollButtonRight
          css={tabWrapperWidth > containerWidth && scrollX !== tabWrapperWidth - containerWidth && scrollButtonVisible}
          onClick={() => moveScroll('right')}
        >
          <Icon name="chevron-down" />
        </ScrollButtonRight>
        <ScrollButtonLeft
          onClick={() => moveScroll('left')}
          css={scrollX > 0 && scrollButtonVisible}
        >
          <Icon name="chevron-down" />
        </ScrollButtonLeft>
      </Container>
    </FixedContainer>
  );
};

export default App;
