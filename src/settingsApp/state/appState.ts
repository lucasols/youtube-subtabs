import { createStore } from 'hookstated';
import { TabProps } from 'settingsApp/state/tabsState';
import { FilterProps } from 'settingsApp/state/filtersState';

type appState = {
  editTab: null | TabProps['id'];
  editFilter: null | FilterProps['id'];
  tabToDelete: null | TabProps['id'];
  filterToDelete: null | FilterProps['id'];
  search: null | string;
};

function getSearchHash() {
  return new URLSearchParams(new URL(window.location.href).search).get(
    'search',
  );
}

const appState = createStore<appState>('app', {
  state: {
    editTab: null,
    editFilter: null,
    tabToDelete: null,
    filterToDelete: null,
    search: getSearchHash(),
  },
});

export default appState;
