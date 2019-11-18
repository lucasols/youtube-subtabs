import styled from '@emotion/styled';
import React from 'react';
import CardListItem from 'settingsApp/components/CardListItem';
import { NestableItemBaseProps } from 'settingsApp/lib/react-nestable';
import {
  FilterProps,
  ExclusiveFilterProps,
} from 'settingsApp/state/filtersState';
import appState from 'settingsApp/state/appState';
import { colorSecondary } from 'settingsApp/style/theme';

type Props = {
  items: NestableItemBaseProps<ExclusiveFilterProps, number>[];
  disableSort?: boolean;
  search?: boolean;
};

const Container = styled.div`
  margin-top: 8px;
  margin-bottom: 20px;
  position: relative;
  width: 100%;
  text-align: center;
`;

const ZeroResults = styled.div`
  font-size: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  margin-top: 8px;
  color: #aaa;
  border: 1.5px solid ${colorSecondary};
`;

function FiltersList({ items, disableSort, search }: Props) {
  function onClick(item: Props['items'][0]) {
    appState.setKey('editFilter', item.id);
  }

  return (
    <Container>
      {items.length > 0 ? (
        (!disableSort
          ? items.sort((a, b) => {
            const nameA =
                a.name || a.userName || a.userId || a.videoNameRegex;
            const nameB =
                b.name || b.userName || b.userId || b.videoNameRegex;

            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }

            return 0;
          })
          : items
        ).map(item => (
          <CardListItem
            key={item.id}
            item={item}
            css={{ marginTop: 8 }}
            index={1}
            maxDepth={1}
            onClick={onClick}
            search={search}
          />
        ))
      ) : (
        <ZeroResults>No filters to show</ZeroResults>
      )}
    </Container>
  );
}

export default FiltersList;
