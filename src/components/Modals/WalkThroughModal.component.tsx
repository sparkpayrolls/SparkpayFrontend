import { Modal } from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

export const WalkThroughModal = NiceModal.create(() => {
  const modal = useModal();

  return (
    <Modal
      title="Walkthrough"
      visible={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      className="WalkThrougModal"
    >
      <iframe
        src="https://www.youtube.com/embed/QTUDwY03fYY?si=uuSK-IHmjK70YQho"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </Modal>
  );
});
