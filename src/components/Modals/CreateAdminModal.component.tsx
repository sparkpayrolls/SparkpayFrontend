import NiceModal from '@ebay/nice-modal-react';
import { CreateAdministratorForm } from '../Form/create-administrator.form';
import { ModalLayout } from './ModalLayout.component';

type ICreateAdminModal = {
  id?: string;
  initialValues?: {
    role: string;
    user: string;
    email: string;
    name: string;
  };
};

export const CreateAdminModal = NiceModal.create<ICreateAdminModal>((props) => {
  return (
    <ModalLayout
      title={props.id ? 'Edit Administrator' : 'Invite Administrator'}
    >
      {(modal) => {
        return (
          <CreateAdministratorForm
            {...props}
            onDone={() => {
              modal.resolve();
              setTimeout(modal.hide, 10);
            }}
          />
        );
      }}
    </ModalLayout>
  );
});
