import NiceModal, { useModal } from '@ebay/nice-modal-react';
import Modal from 'antd/lib/modal/Modal';

interface IConfirmationModal {
  text?: string;
  title?: string;
  okText?: string;
  cancelText?: string;
}

const ConfirmationModal = NiceModal.create<any>((props: IConfirmationModal) => {
  const modal = useModal();

  const handleOk = () => {
    modal.resolve(true);
    setTimeout(modal.hide.bind(modal), 5);
  };

  const handleCancel = () => {
    modal.resolve(false);
    setTimeout(modal.hide.bind(modal), 5);
  };

  return (
    <Modal
      title={props.title || 'Warning'}
      visible={modal.visible}
      onOk={handleOk}
      centered
      onCancel={handleCancel}
      okText={props.okText || 'Yes, I am sure!'}
      cancelText={props.cancelText || 'No, cancel!'}
      className="confirmation-popup"
    >
      <p className="organization-text-modal">{props.text || 'Are you sure?'}</p>
    </Modal>
  );
});

export const confirmation = (param: IConfirmationModal) => {
  return NiceModal.show(ConfirmationModal, param as any);
};
