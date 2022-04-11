import { Drawer } from 'antd';
import { useModal } from '@ebay/nice-modal-react';
import { IModalLayout } from '../types';

export const ModalLayout = (props: IModalLayout) => {
  const modal = useModal();

  return (
    <Drawer
      visible={modal.visible}
      onClose={modal.hide}
      destroyOnClose
      placement="right"
      className={`modal-layout ${props.className}`}
      maskStyle={{
        background: '#0d0f114d',
      }}
    >
      <div className="modal-layout__content">
        <div className="modal-layout__title-section">
          <p className="modal-layout__title-text">{props.title}</p>
          <button
            className="modal-layout__close-btn"
            aria-label="Close"
            type="button"
            onClick={modal.hide}
          >
            <CloseModalSVG />
          </button>
        </div>

        <div className="modal-layout__body-section">
          {
            // @ts-ignore
            !!props.children && props.children(modal)
          }
        </div>
      </div>
    </Drawer>
  );
};

const CloseModalSVG = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 5.58623L11.95 0.63623L13.364 2.05023L8.414 7.00023L13.364 11.9502L11.95 13.3642L7 8.41423L2.05 13.3642L0.636002 11.9502L5.586 7.00023L0.636002 2.05023L2.05 0.63623L7 5.58623Z"
      fill="#6D7A98"
    />
  </svg>
);
