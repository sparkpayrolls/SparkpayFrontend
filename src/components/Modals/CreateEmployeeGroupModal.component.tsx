import NiceModal from '@ebay/nice-modal-react';
import { EmployeeGroupForm } from '../Form/employee-group.form';
import { ModalLayout } from './ModalLayout.component';

type ICreateEmployeeGroupModal = {
  id?: string;
  initialValues?: {
    name: string;
    description?: string;
    commonSalary?: number;
  };
};

export const CreateEmployeeGroupModal = NiceModal.create<ICreateEmployeeGroupModal>(
  (props) => {
    return (
      <ModalLayout title="Create Employee Group">
        {(modal) => {
          return (
            <EmployeeGroupForm
              onDone={(group) => {
                modal.resolve(group);
                setTimeout(modal.hide, 10, group);
              }}
              id={props.id}
              initialValues={props.initialValues}
            />
          );
        }}
      </ModalLayout>
    );
  },
);
