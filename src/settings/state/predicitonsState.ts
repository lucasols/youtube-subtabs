import { createStore } from 'hookstated';
import appState from 'state/appState';

type predicitonsState = {
  selected: null | number;
  predicitons: {
    lngLat: [number, number];
    risco: string;
    equipment: string;
    codigo: string;
    data: string;
    clima: string;
  }[];
};

const predicitonsState = createStore<predicitonsState>('predictions', {
  state: {
    selected: null,
    predicitons: [],
  },
});

export function showPredictionCard(id: number) {
  appState.setKey('viewUsedBeforeShowCard', appState.getState().activeView);
  appState.setKey('activeView', 'map');
  predicitonsState.setKey('selected', id);
}

export function closePredictionCard() {
  appState.setKey('activeView', appState.getState().viewUsedBeforeShowCard);
  predicitonsState.setKey('selected', null);
}

export default predicitonsState;
