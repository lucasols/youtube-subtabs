import React from 'react';
import styled from '@emotion/styled';
import Modal from 'components/Modal';
import filtersState, { deleteFilters } from 'state/filtersState';
import appState from 'state/appState';
import { centerContent } from 'style/modifiers';
import Button from 'components/Button';

const Container = styled(Modal)`
  width: 240px;
`;

const DeleteFilterModal = () => {
  const [itemToDeleteId, setItemToDeleteId] = appState.useStore('filterToDelete');
  const itemToDelete = filtersState.getState().filters.find(
    (item) => item.id === itemToDeleteId,
  );

  function onCloseModal() {
    setItemToDeleteId(null);
  }

  function onConfirm() {
    if (itemToDeleteId) {
      deleteFilters([itemToDeleteId]);
      onCloseModal();
    }
  }

  return (
    <Container
      title={`Delete Filter?`}
      show={!!itemToDelete}
      onClose={onCloseModal}
    >
      {itemToDelete?.name}
      <div css={[centerContent, { width: '100%', marginTop: 16 }]}>
        <Button label="Cancel" small onClick={onCloseModal} />
        <Button label="Delete" small css={{ marginLeft: 'auto' }} onClick={onConfirm} />
      </div>
    </Container>
  );
};

export default DeleteFilterModal;
