import { Options as JOptions } from 'jspreadsheet-ce';
import { useRouter } from 'next/router';
import { useRef, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { useBanks } from 'src/helpers/hooks/use-banks.hook';
import { usePayoutMethods } from 'src/helpers/hooks/use-payout-methods.hook';
import { Util } from 'src/helpers/util';
import { BulkEmployeeAddValidation } from 'src/helpers/validation';
import { useAppSelector } from 'src/redux/hooks';
import { ValidationError } from 'yup';

export const useEmployeeListContext = () => {
  const router = useRouter();
  const { gotoPayrollCreation } = router.query;
  const administrator = useAppSelector((state) => state.administrator);
  const country = Util.getCountryFromAdministrator(administrator);
  const sheetRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [payoutMethods, loadingPayoutMethods] = usePayoutMethods(country?.id);
  const { banks, loading: loadingBanks } = useBanks({
    all: true,
    country: country?.id,
  });
  const loading = loadingBanks || loadingPayoutMethods;

  const validateAccountDetails = useCallback(
    async (bankId: string, accountNumber: string) => {
      const [payoutMethod] = payoutMethods;
      if (payoutMethod) {
        return $api.payout.validatePayoutMethod(payoutMethod.id, {
          bankId,
          accountNumber,
        });
      }

      return Promise.resolve(null);
    },
    [payoutMethods],
  );

  const getColumnIndex = useCallback((name: string) => {
    switch (name) {
      case 'lastname':
        return 1;

      case 'salary':
        return 2;

      case 'email':
        return 3;

      case 'phoneNumber':
        return 4;
      case 'accountNumber':
        return 6;
      default:
        return 0;
    }
  }, []);

  const setCellError = useCallback(
    (columnIndex: number, rowIndex: number, message: string) => {
      const cell = tableRef.current?.getCell([columnIndex, rowIndex]);

      cell?.classList?.add('error-cell');
      (cell ?? {}).title = message;
    },
    [],
  );

  const handleAddRowClick = useCallback(() => {
    tableRef.current?.insertRow(10);
  }, []);

  const handleSubmitClick = useCallback(() => {
    const [payoutMethod] = payoutMethods;
    if (payoutMethod) {
      // clear all error cells
      Array.prototype.forEach.call(
        document.getElementsByClassName('error-cell'),
        (el) => {
          el.classList.remove('error-cell');
          el.removeAttribute('title');
        },
      );

      // get data from jspreadsheet
      const data = tableRef.current?.getData() || [];
      const payload = [];
      const indexes = {} as Record<string, { index: number }>;

      for (let i = 0; i < data.length; i += 1) {
        const [
          firstname,
          lastname,
          salary,
          email,
          phoneNumber,
          bankId,
          accountNumber,
        ] = data[i];
        if (data[i].some((d: string) => !!d)) {
          const current = {
            firstname,
            lastname,
            salary: salary.replace(/\D/g, ''),
            email,
            phoneNumber,
            payoutMethod: payoutMethod.id,
            payoutMethodMeta: { bankId, accountNumber },
          };

          const index = payload.push(current) - 1;

          indexes[index] = { index: i };
        }
      }

      // only continue if data exists
      if (payload.length) {
        setIsSubmitting(true);
        BulkEmployeeAddValidation.validate(payload, { abortEarly: false })
          .then((employees) => {
            if (employees) {
              return $api.employee.addEmployees({ employees });
            }
          })
          .then(() => {
            toast.success('Employees added successfully.');
            if (gotoPayrollCreation) {
              router.push('/payroll/create');
              return;
            }
            router.push('/employees');
          })
          .catch((err) => {
            if (!(err instanceof ValidationError)) {
              throw err;
            }
            const errors = Util.transformYupErrorsIntoObject(err);
            Object.keys(errors).map((key) => {
              const [index, name] = key.replace(/(\[|\])/g, '').split('.');
              const rowIndex = indexes[index].index;
              const columnIndex = getColumnIndex(name);

              const message = errors[key];
              setCellError(columnIndex, rowIndex, message);
            });
            toast.error(
              'fix errors in cells highlighted with red to continue',
              {
                position: 'top-center',
              },
            );
          })
          .catch((err) => {
            Util.onNonAuthError(err, (httpError) => {
              if (httpError.status === 422) {
                const errors = (httpError.errors as unknown) as Record<
                  string,
                  Record<string, string>
                >;
                Object.keys(errors).map((index) => {
                  Object.keys(errors[index]).map((name) => {
                    setCellError(
                      getColumnIndex(name),
                      indexes[index].index,
                      errors[index][name],
                    );
                  });
                });
              }
              toast.error(httpError.message);
            });
          })
          .finally(() => {
            setIsSubmitting(false);
          });
      }
    }
  }, [
    getColumnIndex,
    gotoPayrollCreation,
    payoutMethods,
    router,
    setCellError,
  ]);

  useEffect(() => {
    // @ts-ignore
    if (sheetRef.current && !sheetRef.current.jspreadsheet) {
      const ref = sheetRef.current;
      const jspreadsheet = require('jspreadsheet-ce');

      const payoutMeta: Record<string, Record<string, unknown>> = {};

      const options: JOptions = {
        data: [],
        tableOverflow: true,
        tableWidth: '100%',
        tableHeight: 'auto',
        contextMenu: () => null,
        columns: [
          { type: 'text', title: 'First Name', width: 135 },
          { type: 'text', title: 'Last Name', width: 135 },
          {
            type: 'numeric',
            title: 'Salary',
            width: 135,
            mask: 'N #,##.00',
            decimal: '.',
          },
          { type: 'text', title: 'Email', width: 200 },
          {
            type: 'text',
            title: 'Phone Number',
            width: 135,
          },
          {
            type: 'dropdown',
            title: 'Bank',
            width: 225,
            autocomplete: true,
            source: banks,
          },
          { type: 'text', title: 'Account Number', width: 130 },
          { type: 'text', readOnly: true, title: 'Account Name', width: 152 },
          // { type: 'calendar', title: 'Available', width: 200 },
          // { type: 'image', title: 'Photo', width: 120 },
          // { type: 'checkbox', title: 'Stock', width: 80 },
          // { type: 'color', width: 100, render: 'square' },
        ],
        onchange(instance, cell, columnIndex, rowIndex, value) {
          cell.classList.remove('error-cell');
          cell.removeAttribute('title');

          if ([5, 6].includes(+columnIndex)) {
            payoutMeta[rowIndex] = {
              ...(payoutMeta[rowIndex] || {}),
              rowIndex,
              [+columnIndex === 5 ? 'bankId' : 'accountNumber']: value,
            };
            const { accountNumber, bankId } = payoutMeta[rowIndex];
            if (accountNumber && bankId) {
              validateAccountDetails(bankId as string, accountNumber as string)
                .then((res) => {
                  if (res) {
                    tableRef.current?.setValueFromCoords(
                      7,
                      +rowIndex,
                      (res as { accountName: string }).accountName,
                      true,
                    );
                  }
                })
                .catch(() => {
                  setCellError(
                    6,
                    +rowIndex,
                    'unable to resolve account details',
                  );
                  setCellError(7, +rowIndex, 'invalid account details');
                });
            }
          }
        },
        minDimensions: [7, 10] as [number, number],
        showIndex: () => false,
      };

      tableRef.current = jspreadsheet(ref, options);

      return () => {
        // @ts-ignore
        ref.jspreadsheet = null;
        return jspreadsheet.destroy(ref);
      };
    }
  }, [loading, banks, getColumnIndex, setCellError, validateAccountDetails]);

  useEffect(() => {
    const id = toast.info(
      'Put your mouse over boxes with red highlight for 2 seconds to see the error.',
      { autoClose: false, closeOnClick: false, draggable: false },
    );

    return () => {
      toast.dismiss(id);
    };
  }, []);

  return {
    handleAddRowClick,
    handleSubmitClick,
    isSubmitting,
    loading,
    sheetRef,
  };
};
