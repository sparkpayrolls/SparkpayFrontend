import NiceModal from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';

type ITaxGroupModal = {
  id?: string;
};

export const TaxGroupModal = NiceModal.create<ITaxGroupModal>((props) => {
  return (
    <ModalLayout
      className="create-role-modal"
      title={props.id ? 'Update Role' : 'Create Role'}
    >
      {(modal) => {
        return <div></div>;
      }}
    </ModalLayout>
  );
});
