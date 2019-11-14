import { createStore } from 'hookstated';
import { NestableItemBaseProps } from 'settingsApp/lib/react-nestable';
import { TabProps } from 'settingsApp/state/tabsState';
import { getUniqueId } from 'utils/getUniqueId';
import appState from 'settingsApp/state/appState';

export type ExclusiveFilterProps = {
  tabs: TabProps['id'][];
  type: 'include' | 'exclude';
  userId: string;
  userName: string;
  videoNameRegex: string;
  daysOfWeek: number[];
}

export type FilterProps = NestableItemBaseProps<ExclusiveFilterProps, number>;

type filtersState = {
  filters: FilterProps[];
};

type Reducers = {
  addFilters: FilterProps[];
  updateFilters: FilterProps[];
  deleteFilters: number[];
}

const filtersState = createStore<filtersState, Reducers>('filtersState', {
  state: {
    filters: module.hot ? [
      {
        id: 1, name: 'test', daysOfWeek: [], tabs: [1], type: 'include', userId: 'a', userName: '', videoNameRegex: 'a',
      },
      {
        id: 2, name: 'test2', daysOfWeek: [], tabs: [3], type: 'include', userId: 'a', userName: '', videoNameRegex: 'a',
      },
      {
        id: 3, name: 'test3', daysOfWeek: [], tabs: [3], type: 'include', userId: 'a', userName: '', videoNameRegex: 'a',
      },
      {
        id: 4, name: 'test4', daysOfWeek: [], tabs: [4], type: 'include', userId: 'a', userName: '', videoNameRegex: 'a',
      },
    ] : [],
  },
  reducers: {
    addFilters: (state, newfilters) => ({
      ...state,
      filters: [...state.filters, ...newfilters],
    }),
    updateFilters: (state, filtersToUpdate) => ({
      ...state,
      filters: state.filters.map(filter => {
        const updatedFilter = filtersToUpdate?.find(({ id }) => id === filter.id);

        return updatedFilter ? { ...filter, ...updatedFilter } : filter;
      }),
    }),
    deleteFilters: (state, ids) => ({
      ...state,
      filters: state.filters.filter(filter => !ids.includes(filter.id as number)),
    }),
  },
});

export function getFilterById(id: FilterProps['id'], filters: FilterProps[] = filtersState.getState().filters) {
  return filters.find((item: typeof filters[0]) => item.id === id);
}

export function deleteFilters(ids: number[]) {
  filtersState.dispatch('deleteFilters', ids);
}

export function setFilterProp<T extends keyof FilterProps>(filterId: FilterProps['id'], prop: T, value: FilterProps[T]) {
  const filter = getFilterById(filterId);

  if (filter && filter?.[prop] !== value) {
    filtersState.dispatch('updateFilters', [{
      ...filter,
      [prop]: value,
    }]);
  }
}

export function changeFilterName(filterId: number, newName: string) {
  if (newName) {
    setFilterProp(filterId, 'name', newName);
  }
}

export function addFilter(tab: TabProps['id'], type: FilterProps['type']) {
  const id = getUniqueId(filtersState.getState().filters);

  filtersState.dispatch('addFilters', [{
    id,
    name: '',
    tabs: [tab],
    type,
    userId: '',
    userName: '',
    videoNameRegex: '',
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
  }]);

  appState.setKey('editFilter', id);
}

export default filtersState;
