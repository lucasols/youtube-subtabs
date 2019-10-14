/* eslint-disable no-lonely-if */
import { TabProps } from 'settingsApp/state/tabsState';
import { FilterProps } from 'settingsApp/state/filtersState';

export function filterIsInvalid(filter: FilterProps) {
  return filter.videoNameRegex === '' && filter.userRegex === '';
}

export function someFilterIsInvalid(filters: FilterProps[]) {
  return filters.some(
    filter => filterIsInvalid(filter),
  );
}

export function checkIfTabIsInvalid(tab: TabProps, filters: FilterProps[], tabs: TabProps[]) {
  const tabFilters = filters.filter(filter => filter.tabs.includes(tab.id));

  // if the tab has filters all filters must be valid
  if (tabFilters.length > 0 && someFilterIsInvalid(tabFilters)) {
    return 'One filter of this tab is invalid';
  }

  // if tab is child
  if (tab.parent !== null) {
    if (tabFilters.length === 0) {
      return 'Child tabs must have at least one filter';
    }

  // if tab is parent
  } else {
    const tabChilds = tab.children || tabs.filter(tabsItem => tabsItem.parent === tab.id);

    // if has not childs
    if (tabChilds.length === 0) {
      if (tabFilters.length === 0 && tab.id !== 'all') {
        return 'Parent tabs without childs must have at least one filter';
      }

    // if has childs
    } else {
      if (tabChilds.some(child => checkIfTabIsInvalid(child, filters, tabs))) {
        return 'Some child of this tab is invalid';
      }
    }
  }

  return undefined;
}

export function getValidParentTabs(tabs: TabProps[], filters: FilterProps[]) {
  return tabs.filter(tab => tab.parent === null && (tab.id === 'all' || !checkIfTabIsInvalid(tab, filters, tabs)));
}
