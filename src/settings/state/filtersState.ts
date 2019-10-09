import { createStore } from 'hookstated';
import { ListItem } from 'utils/flatToNested';

type filtersState = {
  tabs: ListItem[];
};

type Reducers = {
  addTabs: ListItem[];
  updateTabs: ListItem[];
  deleteTabs: number[];
}

const filtersState = createStore<filtersState, Reducers>('tabsState', {
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

export function getTabById(id: ListItem['id'], tabs: ListItem[] = filtersState.getState().tabs) {
  return tabs.find((item: typeof tabs[0]) => item.id === id);
}

export function deleteTabs(ids: number[]) {
  filtersState.dispatch('deleteTabs', ids);
}

export function setTabProp<T extends keyof ListItem>(tabId: ListItem['id'], prop: T, value: ListItem[T]) {
  const tab = getTabById(tabId);

  if (tab && tab?.[prop] !== value) {
    filtersState.dispatch('updateTabs', [{
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

export default filtersState;
