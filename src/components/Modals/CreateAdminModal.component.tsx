import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { CreateAdministratorForm } from '../Form/create-administrator.form';
import { ModalLayout } from './ModalLayout.component';

export const CreateAdminModal = NiceModal.create(() => {
  return (
    <ModalLayout title="Create Administrator">
      {() => {
        return <CreateAdministratorForm />;
      }}
    </ModalLayout>
  );
});
