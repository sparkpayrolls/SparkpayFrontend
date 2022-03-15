import React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { adminRole } from '../types';
import { Formik, FormikProps } from 'formik';
import { Input } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { TableV2 } from '@/components/Table/Table.component';
import { TableLayout } from '@/components/Table/table-layout.component';
import { CheckboxTableColumn } from '@/components/Table/check-box-table-col.component';

export const AdminRoleModal = NiceModal.create(() => {
  return (
    <ModalLayout title="Admin Role">
      {() => {
        return <AdminRoleForm />;
      }}
    </ModalLayout>
  );
});

const AdminRoleForm = () => {
  return (
    <div className="admin-role-page">
      <Formik
        initialValues={{
          role: '',
        }}
        onSubmit={(...args) => {
          console.log(args);
        }}
        //   // validationSchema={singleEmployeeUploadValidationSchema}
      >
        {(props: FormikProps<adminRole>) => {
          const { handleChange, handleSubmit } = props;
          return (
            <form
              onSubmit={handleSubmit}
              className="single-employee-upload-form"
              autoComplete="off"
            >
              <div className="">
                <Input
                  type="text"
                  label=" Role Name"
                  placeholder="Customer Relations"
                  name="Role"
                  onChange={handleChange}
                />
              </div>
              <p className="admin-role-page__admin-table-header">
                Admin Pemissions
              </p>
              <div className="admin-role-page__admin-table">
                <TableLayout>
                  <TableV2>
                    <thead>
                      <tr>
                        <th>User Management</th>
                        <th>View</th>
                        <th>Edit</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>User Management</td>
                        <td>
                          <CheckboxTableColumn element="td"></CheckboxTableColumn>
                        </td>
                        <td>
                          <CheckboxTableColumn element="td"></CheckboxTableColumn>
                        </td>
                        <td>
                          <CheckboxTableColumn element="td"></CheckboxTableColumn>
                        </td>
                      </tr>
                    </tbody>
                  </TableV2>
                </TableLayout>
              </div>
              <div className="admin-role-page__admin-button">
                <Button
                  type="submit"
                  label="Save Role"
                  className=" admin-role-page__admin-role-button"
                  primary
                />
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};
