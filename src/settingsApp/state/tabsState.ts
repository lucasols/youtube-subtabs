import { createStore } from 'hookstated';
import { NestableItemBaseProps } from 'settingsApp/lib/react-nestable';
import { getUniqueId } from 'utils/getUniqueId';
import appState from 'settingsApp/state/appState';
import filtersState, { setFilterProp } from 'settingsApp/state/filtersState';
import data from '../../../test/testData';

export type ExclusiveTabProps = {
  includeChildsFilter: boolean;
  parent: null | TabProps['id'];
}

export type TabProps = NestableItemBaseProps<ExclusiveTabProps>;

type tabsState = {
  tabs: TabProps[];
};

type Reducers = {
  addTabs: tabsState['tabs'];
  updateTabs: tabsState['tabs'];
  deleteTabs: number[];
}

const tabsState = createStore<tabsState, Reducers>('tabsState', {
  state: {
    tabs: module.hot ? data.tabs || [] : [],
  },
  reducers: {
    addTabs: (state, newtabs) => ({
      ...state,
      tabs: [...state.tabs, ...newtabs],
    }),
    updateTabs: (state, tabsToUpdate) => ({
      ...state,
      tabs: state.tabs.map(tab => {
        const updatedTab = tabsToUpdate?.find(({ id }) => id === tab.id);

        return updatedTab ? { ...tab, ...updatedTab } : tab;
      }),
    }),
    deleteTabs: (state, ids) => ({
      ...state,
      tabs: state.tabs.filter(tab => !(ids.includes(tab.id as number) || ids.includes(tab.parent as number))),
    }),
  },
});

export function getTabById(id: TabProps['id'], tabs: TabProps[] = tabsState.getState().tabs) {
  return tabs.find((item: typeof tabs[0]) => item.id === id);
}

export function deleteTabs(ids: number[]) {
  tabsState.dispatch('deleteTabs', ids);

  tabsState.getState().tabs.forEach(tab => {
    if (ids.includes(tab.parent as number)) {
      deleteTabs([tab.id as number]);
    }
  });

  filtersState.getState().filters.forEach(filter => {
    ids.forEach(tabId => {
      if (filter.tabs.includes(tabId)) {
        setFilterProp(filter.id, 'tabs', filter.tabs.filter(filterTabId => tabId !== filterTabId));
      }
    });
  });

  ids.forEach(id => {
    filtersState.dispatch('deleteFilters', filtersState.getState().filters.filter(item => item.tabs.length === 1 && item.tabs.includes(id)).map(item => item.id));
  });
}

export function setTabProp<T extends keyof TabProps>(tabId: TabProps['id'], prop: T, value: TabProps[T]) {
  const tab = getTabById(tabId);

  if (tab && tab?.[prop] !== value) {
    tabsState.dispatch('updateTabs', [{
      ...tab,
      [prop]: value,
    }]);
  }
}

export function changeTabName(tabId: number | 'all', newName: string) {
  if (newName && !/_/.test(newName)) {
    setTabProp(tabId, 'name', newName);
  }
}

export function addTab(parent: TabProps['parent']) {
  const id = getUniqueId(tabsState.getState().tabs);

  tabsState.dispatch('addTabs', [{
    id,
    includeChildsFilter: true,
    name: 'New tab',
    parent,
  }]);

  appState.setKey('editTab', id);
}

export default tabsState;
