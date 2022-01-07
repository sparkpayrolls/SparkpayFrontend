import React, { useState } from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Radio } from 'antd';
import { Administrator } from 'src/api/types';
import { Util } from 'src/helpers/util';
import {
  EmployeeAddForm,
  EmployeeBulkAddForm,
} from '../Form/employee-add.form';
import { IF } from '../Misc/if.component';
import { getEmployeeAddSubmitHandler } from 'src/helpers/methods';

export const AddEmployeeModal = NiceModal.create(
  (props: { administrator: Administrator }) => {
    return (
      <ModalLayout title="Add Employee">
        {(modal) => {
          return (
            <AddEmployeeForm
              modal={modal}
              administrator={props.administrator}
            />
          );
        }}
      </ModalLayout>
    );
  },
);

const AddEmployeeForm = ({
  modal,
  administrator,
}: {
  modal: NiceModalHandler;
  administrator: Administrator;
}) => {
  const [uploadType, setUploadType] = useState<'singleUpload' | 'bulkUpload'>(
    'singleUpload',
  );

  return (
    <div className="add-employee-modal">
      <div className="add-employee-modal__upload-type-input">
        <label>Select Upload Type</label>
        <Radio.Group
          name="uploadType"
          onChange={(e) => setUploadType(e.target.value)}
          className="add-employee-modal__upload-type-input__radio-group"
          value={uploadType}
        >
          <Radio value="singleUpload">Single Upload</Radio>
          <Radio value="bulkUpload">Bulk Upload</Radio>
        </Radio.Group>
      </div>

      <IF condition={uploadType === 'singleUpload'}>
        <EmployeeAddForm
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            salary: '',
          }}
          onSubmit={getEmployeeAddSubmitHandler((employee) => {
            modal.resolve(employee);
            setTimeout(modal.hide, 100);
          })}
          currency={Util.getCurrencySymbolFromAdministrator(administrator)}
        />
      </IF>

      <IF condition={uploadType === 'bulkUpload'}>
        <EmployeeBulkAddForm
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            salary: '',
          }}
          onSubmit={getEmployeeAddSubmitHandler((employee) => {
            modal.resolve(employee);
            setTimeout(modal.hide, 100);
          })}
          currency={Util.getCurrencySymbolFromAdministrator(administrator)}
        />
      </IF>
    </div>
  );
};
