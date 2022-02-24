import NiceModal from '@ebay/nice-modal-react';
import { EmployeeGroupForm } from '../Form/employee-group.form';
import { ModalLayout } from './ModalLayout.component';

export const CreateEmployeeGroupModal = NiceModal.create(() => {
  return (
    <ModalLayout title="Create Employee Group">
      {(modal) => {
        return (
          <EmployeeGroupForm
            onDone={(group) => {
              modal.resolve(group);
              setTimeout(modal.hide, 10, group);
            }}
          />
        );
      }}
    </ModalLayout>
  );
});
