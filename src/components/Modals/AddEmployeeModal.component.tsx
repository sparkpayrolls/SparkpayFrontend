import React, { useState } from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Radio } from 'antd';
import { Administrator } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { EmployeeAddForm } from '../Form/employee-add.form/employee-add.form';
import { IF } from '../Misc/if.component';
import { getEmployeeAddSubmitHandler } from 'src/helpers/methods';
import { EmployeeBulkAddForm } from '../Form/employee-add.form/employee-bulk-add-form.component/employee-bulk-add-form.component';
import { useRouter } from 'next/router';

export const AddEmployeeModal = NiceModal.create(
  (props: { administrator: Administrator }) => {
    return (
      <ModalLayout title="Add Employee">
        {(modal) => {
          return <AddEmployeeForm modal={modal} {...props} />;
        }}
      </ModalLayout>
    );
  },
);

const AddEmployeeForm = ({
  modal,
  administrator,
  gotoPayrollCreation,
}: {
  modal: NiceModalHandler;
  administrator: Administrator;
  gotoPayrollCreation?: boolean;
}) => {
  const router = useRouter();
  const [uploadType, setUploadType] = useState<'singleUpload' | 'bulkUpload'>(
    'bulkUpload',
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
          <Radio value="bulkUpload">Bulk Upload</Radio>
          <Radio value="singleUpload">Single Upload</Radio>
        </Radio.Group>
      </div>

      <IF condition={uploadType === 'singleUpload'}>
        <EmployeeAddForm
          initialValues={{
            firstname: '',
            lastname: '',
            email: '',
            salary: '',
            phoneNumber: '',
          }}
          onSubmit={getEmployeeAddSubmitHandler((employee) => {
            setTimeout(modal.hide, 20);
            if (gotoPayrollCreation) {
              router.replace('/payroll/create');
              return;
            }

            modal.resolve(employee);
          })}
          currency={Util.getCurrencySymbolFromAdministrator(administrator)}
          country={Util.getCountryFromAdministrator(administrator)?.id}
        />
      </IF>

      <IF condition={uploadType === 'bulkUpload'}>
        <EmployeeBulkAddForm
          gotoPayrollCreation={gotoPayrollCreation}
          onSubmit={modal.hide}
        />
      </IF>
    </div>
  );
};
