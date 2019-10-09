import { createStore } from 'hookstated';
import { type } from 'os';

type appState = {
  editTab: null | 'all' | 'new' | number;
  editFilter: null | 'all' | 'new' | number;
  tabToDelete: null | number;
  addTabParent: number | null;
};

type Reducers = {
  addSubtab: { parent: number };
}

const appState = createStore<appState, Reducers>('app', {
  state: {
    editTab: null,
    editFilter: null,
    tabToDelete: null,
    addTabParent: null,
  },
  reducers: {
    addSubtab: (state, { parent }) => ({
      ...state,
      editTab: 'new',
      addTabParent: parent,
    }),
  },
});

export default appState;
