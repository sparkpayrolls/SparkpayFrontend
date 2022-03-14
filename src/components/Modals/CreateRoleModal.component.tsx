import NiceModal from '@ebay/nice-modal-react';
import { CreateRoleForm } from '../Form/create-role.form';
import { ModalLayout } from './ModalLayout.component';

export const CreateRoleModal = NiceModal.create(() => {
  return (
    <ModalLayout className="create-role-modal" title="Create Role">
      {() => {
        return <CreateRoleForm />;
      }}
    </ModalLayout>
  );
});
