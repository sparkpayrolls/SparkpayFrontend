import NiceModal from '@ebay/nice-modal-react';
import { EmployeeGroupForm } from '../Form/employee-group.form';
import { ModalLayout } from './ModalLayout.component';

export const CreateEmployeeGroupModal = NiceModal.create(() => {
  return (
    <ModalLayout title="Create Employee Group">
      {() => {
        return <EmployeeGroupForm />;
      }}
    </ModalLayout>
  );
});
