import { createStore } from 'hookstated';

type Views = 'list' | 'map';

type appState = {
  editTab: null | string,
  editFilter: null | string,
};

const appState = createStore<appState>('app', {
  state: {
    editTab: null,
    editFilter: null,
  },
});

export default appState;
