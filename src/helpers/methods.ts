/* eslint-disable no-unused-vars */
import { AddEmployee } from '@/components/types';
import { NiceModalHandler } from '@ebay/nice-modal-react';
import { FormikHelpers } from 'formik';
import { pick } from 'lodash';
import { ChangeEvent } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Employee } from 'src/api/types';
import { IgetBulkEmployeeFileUploadHandler, IgetEmployeeMethod } from './types';
import { Util } from './util';

export const getEmployeeAddSubmitHandler = (
  onDone?: (employee: Employee) => any,
) => {
  return async (values: AddEmployee, helpers: FormikHelpers<AddEmployee>) => {
    try {
      helpers.setSubmitting(true);
      const employee = await $api.employee.addSingleEmployee({
        ...values,
        salary: +values.salary,
      });
      toast.success('Employee added successfully', {
        position: 'bottom-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      if (onDone) {
        onDone(employee);
      }
    } catch (error) {
      const err = error as HttpError;
      if (err.errors && Object.keys(err.errors).length) {
        helpers.setErrors(err.errors);
      } else {
        toast.error(err.message);
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };
};

export const getEmployeeEditSubmitHandler = (
  id: string,
  getEmployee: () => any,
) => {
  return async (
    modal: NiceModalHandler,
    values: AddEmployee,
    helpers: FormikHelpers<AddEmployee>,
  ) => {
    try {
      helpers.setSubmitting(true);
      await $api.employee.updateSingleEmployee(id, {
        ...pick(values, ['firstname', 'lastname', 'email']),
        salary: +values.salary,
      });
      await getEmployee();
      toast.success('Employee details updated');
      modal.hide();
    } catch (error) {
      const err = error as HttpError;
      if (err.errors && Object.keys(err.errors).length) {
        helpers.setErrors(err.errors);
      } else {
        toast.error(err.message);
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };
};

export const getEmployeeMethod = (params: IgetEmployeeMethod) => {
  const {
    employeeId,
    apiCallStarted,
    setEmployee,
    setNotFound,
    apiCallDone,
  } = params;

  return async () => {
    try {
      if (!employeeId) {
        return;
      }

      apiCallStarted();
      const employee = await $api.employee.getSingleEmployee(employeeId);
      setEmployee(employee);
    } catch (error) {
      const err = error as HttpError;
      if (err.status === 404) {
        setNotFound(true);
      }
    } finally {
      apiCallDone();
    }
  };
};

export const getBulkEmployeeFileUploadHandler = (
  params: IgetBulkEmployeeFileUploadHandler,
) => {
  const { setTouched, setFile, setValues } = params;

  return (e: ChangeEvent<HTMLInputElement>) => {
    setTouched({ file: true });
    const files = e.target.files;
    if (files) {
      const file = files[0];
      const fileTooLarge = file.size * 1e-6 > 10;

      if (!Util.validXLSXFileTypes().includes(file.type) || fileTooLarge) {
        let message = 'Upload a valid Spreadsheet file';
        if (fileTooLarge) {
          message = 'File size is greater than 10mb';
        }

        toast.error(message, {
          position: 'top-center',
        });
        setFile(null);
        return;
      }

      setFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setValues({
          file: JSON.stringify({
            filename: file.name,
            data: fileReader.result,
          }),
        });
      };
      fileReader.readAsDataURL(file);
    }
  };
};
