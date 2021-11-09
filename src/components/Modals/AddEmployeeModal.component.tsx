import React from 'react';
import { Drawer } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

const AddEmployeeModal = NiceModal.create(() => {
  const modal = useModal();

  return (
    <>
      <Drawer
        title="Basic Drawer"
        placement="right"
        onClose={modal.hide}
        visible={modal.visible}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
});

export default AddEmployeeModal;
