import React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { IEditEmployeeDetailsModal } from '../types';
import { Util } from 'src/helpers/util';
import { EmployeeAddForm } from '../Form/employee-add.form';

export const EditEmployeeDetailsModal = NiceModal.create(
  (props: IEditEmployeeDetailsModal) => {
    return (
      <ModalLayout title="Edit Details">
        {(modal) => {
          return (
            <div className="edit-details-modal">
              <EmployeeAddForm
                initialValues={{
                  ...props.employee,
                  salary: String(props.employee.salary),
                }}
                currency={Util.getCurrencySymbolFromAdministrator(
                  props.administrator,
                )}
                onSubmit={(...args) => props.onSubmit(modal, ...args)}
              />
            </div>
          );
        }}
      </ModalLayout>
    );
  },
);
