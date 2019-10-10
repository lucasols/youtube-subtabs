import { createStore } from 'hookstated';
import { NestableItemBaseProps } from 'lib/react-nestable';
import { getUniqueId } from 'utils/getUniqueId';
import appState from 'state/appState';

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
    tabs: [
      { id: 'all', name: 'All', parent: null, includeChildsFilter: true },
      { id: 1, name: 'Must Watch', parent: null, includeChildsFilter: true },
      { id: 2, name: 'Humor', parent: null, includeChildsFilter: true },
      { id: 3, name: 'Games', parent: 1, includeChildsFilter: true },
      { id: 4, name: 'Science', parent: 2, includeChildsFilter: true },
      { id: 5, name: 'Movies', parent: null, includeChildsFilter: true },
    ],
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

  // ids.forEach()
  // TODO: delete filters
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

export function addTab(parent: TabProps['id']) {
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
