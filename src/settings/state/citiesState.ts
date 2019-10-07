import { createStore } from 'hookstated';
import axios from 'axios';
import { apiUrl } from 'utils/apiUrl';

type citiesState = {
  selected: string;
  cities:
    | {
        nome: string;
        sigla: string;
        cidade: string;
      }[]
    | null;
};

const citiesState = createStore<citiesState>('cities', {
  state: {
    selected: 'all',
    cities: null,
  },
});

export function fetchCities() {
  axios
    .get<citiesState['cities']>(`${apiUrl}subestacoes`)
    .then(response => {
      if (response.data) {
        citiesState.setKey(
          'cities',
          response.data
        );
      }

      if (response.data && response.data[0]) {
        citiesState.setKey('selected', response.data[0].sigla);
      }
    })
    .catch(error => {
      console.log(error);
    });
}

export function getCity(id: string) {
  const { cities } = citiesState.getState();

  if (id === 'all') return 'all';

  if (cities) {
    return cities.find(item => id === item.sigla);
  }

  return undefined;
}

export default citiesState;
