import NiceModal from '@ebay/nice-modal-react';
import { CreateRoleForm } from '../Form/create-role.form';
import { ModalLayout } from './ModalLayout.component';

type ICreateRoleModal = {
  id?: string;
  initialValues?: {
    name: string;
    permissions: string[];
  };
};

export const CreateRoleModal = NiceModal.create<ICreateRoleModal>((props) => {
  return (
    <ModalLayout
      className="create-role-modal"
      title={props.id ? 'Update Role' : 'Create Role'}
    >
      {(modal) => {
        return (
          <CreateRoleForm
            {...props}
            onDone={(role) => {
              modal.resolve(role);
              setTimeout(modal.hide, 10);
            }}
          />
        );
      }}
    </ModalLayout>
  );
});
