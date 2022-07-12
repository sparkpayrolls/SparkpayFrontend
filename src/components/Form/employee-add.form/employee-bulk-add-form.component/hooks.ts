import classNames from 'classnames';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { ChangeEvent, MouseEvent as ReactMouseEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { usePayoutMethods } from 'src/helpers/hooks/use-payout-methods.hook';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';
import {
  IgetBulkEmployeeFileUploadHandler,
  useEmployeeBulAddFormContextPayload,
  Values,
} from './types';

export const useEmployeeBulAddFormContext = (
  payload: useEmployeeBulAddFormContextPayload,
) => {
  const { onSubmit } = payload;
  const router = useRouter();
  const administrator = useAppSelector((state) => state.administrator);
  const [file, setFile] = useState<File | null>(null);
  const [uploadTextActive, setUploadTextActive] = useState(false);
  const [payoutMethods, loadingPayoutMethods] = usePayoutMethods(
    Util.getCountryFromAdministrator(administrator)?.id,
  );
  const fileUploadClass = classNames('form__file-upload', {
    ['active']: !!file || uploadTextActive,
  });
  const initialValues = { file: '', fileName: '', payoutMethod: '' };
  const handleFormikSubmit = (
    { file, fileName }: Values,
    helpers: FormikHelpers<Values>,
  ) => {
    helpers.setSubmitting(true);
    $api.file
      .uploadTemporaryFile({ filename: fileName, data: file })
      .then((file) => {
        const url = stringifyUrl({
          url: '/employees/employee-list',
          query: { file: file.id },
        });

        onSubmit();
        router.replace(url);
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        helpers.setSubmitting(false);
      });
  };
  const getFileUploadHandler = (params: IgetBulkEmployeeFileUploadHandler) => {
    const { setErrors, setTouched, setValues, values } = params;

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

          setErrors({ file: message });
          setFile(null);
          return;
        }

        setFile(file);
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setValues({
            ...values,
            fileName: file.name,
            file: fileReader.result as string,
          });
        };
        fileReader.readAsDataURL(file);
      }
    };
  };
  const getDownloadClickHandler = (payoutMethod: string) => {
    return async (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      $api.employee
        .getEmployeeUploadSheetFormat(payoutMethod)
        .then(Util.downloadFile);
    };
  };

  return {
    fileUploadClass,
    getDownloadClickHandler,
    getFileUploadHandler,
    handleFormikSubmit,
    initialValues,
    loadingPayoutMethods,
    payoutMethods: payoutMethods.map((pm) => ({
      label: pm.name,
      value: pm.id,
    })),
    setUploadTextActive,
  };
};
