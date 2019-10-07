import { createStore } from 'hookstated';
import appState from 'state/appState';

type equipmentsState = {
  selected: null | string;
  equipments:
    | {
        codigo: string;
        tipo: string;
        fase: string;
        lat: number;
        long: number;
        clientes: string;
      }[]
    | null;
};

const equipmentsState = createStore<equipmentsState>('equipments', {
  state: {
    selected: null,
    equipments: [],
  },
});

export function showEquipmentCard(id: string) {
  appState.setKey('viewUsedBeforeShowCard', appState.getState().activeView);
  appState.setKey('activeView', 'map');
  equipmentsState.setKey('selected', id);
}

export function closeEquipmentCard() {
  appState.setKey('activeView', appState.getState().viewUsedBeforeShowCard);
  equipmentsState.setKey('selected', null);
}

export default equipmentsState;
