import { createStore } from 'hookstated';
import { NestableItemBaseProps } from 'settingsApp/lib/react-nestable';
import { getUniqueId } from 'utils/getUniqueId';
import appState from 'settingsApp/state/appState';
import filtersState from 'settingsApp/state/filtersState';

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
    tabs: module.hot ? [
      { id: 'all', name: 'All', parent: null, includeChildsFilter: false },
      { id: 1, name: 'Must Watch', parent: null, includeChildsFilter: true },
      { id: 2, name: 'Humor', parent: null, includeChildsFilter: true },
      { id: 3, name: 'Games', parent: 1, includeChildsFilter: true },
      { id: 4, name: 'Science', parent: 2, includeChildsFilter: true },
      { id: 5, name: 'Movies', parent: null, includeChildsFilter: true },
      { id: 6, name: 'All', parent: null, includeChildsFilter: true },
      { id: 7, name: 'Must Watch', parent: null, includeChildsFilter: true },
      { id: 8, name: 'Humor', parent: 1, includeChildsFilter: true },
      { id: 9, name: 'All', parent: 1, includeChildsFilter: true },
      { id: 10, name: 'Must Watch', parent: 1, includeChildsFilter: true },
      { id: 11, name: 'Humor', parent: null, includeChildsFilter: true },
      { id: 12, name: 'All', parent: 1, includeChildsFilter: true },
      { id: 13, name: 'Must Watch', parent: 1, includeChildsFilter: true },
      { id: 14, name: 'Humor', parent: null, includeChildsFilter: true },
      { id: 15, name: 'All', parent: 1, includeChildsFilter: true },
      { id: 16, name: 'Must Watch', parent: 1, includeChildsFilter: true },
      { id: 17, name: 'Humor', parent: null, includeChildsFilter: true },
      { id: 18, name: 'Humor', parent: null, includeChildsFilter: true },
      { id: 19, name: 'Humor', parent: null, includeChildsFilter: true },
      { id: 20, name: 'Humor', parent: null, includeChildsFilter: true },
      { id: 21, name: 'Humor', parent: null, includeChildsFilter: true },
      { id: 22, name: 'Humor', parent: null, includeChildsFilter: true },
      { id: 23, name: 'Humor', parent: null, includeChildsFilter: true },
      { id: 24, name: 'Humor', parent: null, includeChildsFilter: true },
    ] : [],
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

  ids.forEach(id => {
    filtersState.dispatch('deleteFilters', filtersState.getState().filters.filter(item => item.tab === id).map(item => item.id));
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

export function changeTabName(tabId: number, newName: string) {
  if (newName) {
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
