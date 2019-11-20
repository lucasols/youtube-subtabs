import { createStore } from 'hookstated';
import { TabProps } from 'settingsApp/state/tabsState';
import { FilterProps, addFilter } from 'settingsApp/state/filtersState';
import { stringToNum } from 'utils/stringToNum';
import { validate } from 'utils/ioTsValidate';
import * as t from 'io-ts';
import { FilterPropsValidator } from 'settingsApp/containers/ExportImportMenu';

type appState = {
  editTab: null | TabProps['id'];
  editFilter: null | FilterProps['id'];
  tabToDelete: null | TabProps['id'];
  filterToDelete: null | FilterProps['id'];
  search: null | string;
};

function getSearchFromUrl() {
  return new URLSearchParams(new URL(window.location.href).search).get(
    'search',
  );
}

function getTabFromUrl() {
  const tab = new URLSearchParams(new URL(window.location.href).search).get(
    'tab',
  );

  return tab === 'all' ? tab : stringToNum(tab) || null;
}

const appState = createStore<appState>('app', {
  state: {
    editTab: getTabFromUrl(),
    editFilter: null,
    tabToDelete: null,
    filterToDelete: null,
    search: getSearchFromUrl(),
  },
});

export function getFilterFromUrl() {
  const urlParams = new URLSearchParams(new URL(window.location.href).search);
  const selectedFilter = urlParams.get('filter');

  if (selectedFilter === null) return;

  if (selectedFilter === 'new') {
    const fields = JSON.parse(urlParams.get('fields') || '');

    validate(
      fields,
      t.partial(FilterPropsValidator.props),
      filter => {
        addFilter(filter);
      },
      () => {
        console.error('invalid new data');
      },
    );
  } else {
    appState.setKey('editFilter', stringToNum(selectedFilter) || null);
  }
}

export default appState;
