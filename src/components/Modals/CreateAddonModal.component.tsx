import NiceModal from '@ebay/nice-modal-react';
import { CreateAddonForm } from '../Form/create-addon.form';
import { ModalLayout } from './ModalLayout.component';

type ICreateAddonModal = {
  id?: string;
  entity: string;
  initialValues?: {
    name: string;
    description?: string;
    commonSalary?: number;
  };
};

export const CreateAddonModal = NiceModal.create<ICreateAddonModal>((props) => {
  return (
    <ModalLayout title={props.id ? 'Edit' : 'Create Addon'}>
      {(modal) => {
        return (
          <CreateAddonForm
            {...props}
            onCreate={(addon) => {
              modal.resolve(addon);
              setTimeout(modal.hide, 10);
            }}
          />
        );
      }}
    </ModalLayout>
  );
});
