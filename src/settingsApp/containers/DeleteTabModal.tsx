import React from 'react';
import styled from '@emotion/styled';
import Modal from 'settingsApp/components/Modal';
import tabsState, { deleteTabs } from 'settingsApp/state/tabsState';
import appState from 'settingsApp/state/appState';
import { centerContent } from 'settingsApp/style/modifiers';
import Button from 'settingsApp/components/Button';

const Container = styled(Modal)`
  max-width: 240px;
`;

const DeleteTabModal = () => {
  const [itemToDeleteId, setItemToDeleteId] = appState.useStore('tabToDelete');
  const itemToDelete = tabsState
    .getState()
    .tabs.find(item => item.id === itemToDeleteId);

  function onCloseModal() {
    setItemToDeleteId(null);
  }

  function onConfirm() {
    if (itemToDeleteId && itemToDeleteId !== 'all') {
      deleteTabs([itemToDeleteId]);
      onCloseModal();
    }
  }

  return (
    <Container
      title={`Delete Tab ${itemToDelete?.name}?`}
      show={!!itemToDelete}
      onClose={onCloseModal}
    >
      All childs will be deleted too!
      <div css={[centerContent, { width: '100%', marginTop: 16 }]}>
        <Button label="Cancel" small onClick={onCloseModal} />
        <Button
          label="Delete"
          small
          css={{ marginLeft: 'auto' }}
          onClick={onConfirm}
        />
      </div>
    </Container>
  );
};

export default DeleteTabModal;
