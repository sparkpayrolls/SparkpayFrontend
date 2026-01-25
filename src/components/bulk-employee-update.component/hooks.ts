import { Options as JOptions } from 'jspreadsheet-ce';
import { useRouter } from 'next/router';
import { useRef, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Employee } from 'src/api/types';
import { useBanks } from 'src/helpers/hooks/use-banks.hook';
import { usePayoutMethods } from 'src/helpers/hooks/use-payout-methods.hook';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';
import { OriginalEmployeeData } from './types';

export const useBulkEmployeeUpdateContext = () => {
  const router = useRouter();
  const administrator = useAppSelector((state) => state.administrator);
  const country = Util.getCountryFromAdministrator(administrator);
  const sheetRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<any>(null);
  const payoutMetaRef = useRef<Record<string, Record<string, unknown>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [originalData, setOriginalData] = useState<OriginalEmployeeData[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [payoutMethods, loadingPayoutMethods] = usePayoutMethods(country?.id);
  const { banks, loading: loadingBanks } = useBanks({
    all: true,
    country: country?.id,
  });
  const loadingData = loadingBanks || loadingPayoutMethods;

  // Load all employees on mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        const response = await $api.employee.getEmployees({ all: true });
        const employeesData = response.data || [];
        setEmployees(employeesData);
        setFilteredEmployees(employeesData);

        // Store original data for comparison
        const original = employeesData.map((emp) => {
          const payoutMeta = (emp.payoutMethodMeta as any) || {};
          return {
            id: emp.id,
            firstname: emp.firstname || '',
            lastname: emp.lastname || '',
            salary: emp.salary || 0,
            yearlyRentAmount: emp.yearlyRentAmount || 0,
            email: emp.email || '',
            phoneNumber: emp.phoneNumber || '',
            bankId: payoutMeta.bankId || '',
            accountNumber: payoutMeta.accountNumber || '',
            accountName: payoutMeta.accountName || '',
          };
        });
        setOriginalData(original);
      } catch (error) {
        toast.error('Failed to load employees');
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  // Filter employees based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredEmployees(employees);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = employees.filter((emp) => {
      const firstname = (emp.firstname || '').toLowerCase();
      const lastname = (emp.lastname || '').toLowerCase();
      const email = (emp.email || '').toLowerCase();
      const fullName = `${firstname} ${lastname}`;

      return (
        firstname.includes(query) ||
        lastname.includes(query) ||
        email.includes(query) ||
        fullName.includes(query)
      );
    });

    setFilteredEmployees(filtered);
  }, [searchQuery, employees]);

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
      case 'id':
        return 0;
      case 'firstname':
        return 1;
      case 'lastname':
        return 2;
      case 'salary':
        return 3;
      case 'yearlyRentAmount':
        return 4;
      case 'email':
        return 5;
      case 'phoneNumber':
        return 6;
      case 'bankId':
        return 7;
      case 'accountNumber':
        return 8;
      case 'accountName':
        return 9;
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

  // Normalize value for comparison
  const normalizeValue = useCallback((value: any, type: string): any => {
    if (value === null || value === undefined) return '';
    if (type === 'salary') {
      const num = typeof value === 'string' ? parseFloat(value.replace(/[^\d.]/g, '')) : value;
      return isNaN(num) ? 0 : num;
    }
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }, []);

  // Check if there are changes
  const checkForChanges = useCallback(() => {
    if (!tableRef.current || originalData.length === 0) {
      setHasChanges(false);
      return;
    }

    const currentData = tableRef.current.getData() || [];
    let hasAnyChanges = false;

    for (let i = 0; i < currentData.length; i += 1) {
      const [
        id,
        firstname,
        lastname,
        salary,
        yearlyRentAmount,
        email,
        phoneNumber,
        bankId,
        accountNumber,
      ] = currentData[i];

      if (!id) continue;

      const original = originalData.find((orig) => orig.id === id);
      if (!original) continue;

      const normalizedCurrent = {
        firstname: normalizeValue(firstname, 'string'),
        lastname: normalizeValue(lastname, 'string'),
        salary: normalizeValue(salary, 'salary'),
        yearlyRentAmount: normalizeValue(yearlyRentAmount, 'salary'),
        email: normalizeValue(email, 'string'),
        phoneNumber: normalizeValue(phoneNumber, 'string'),
        bankId: normalizeValue(bankId, 'string'),
        accountNumber: normalizeValue(accountNumber, 'string'),
      };

      const normalizedOriginal = {
        firstname: normalizeValue(original.firstname, 'string'),
        lastname: normalizeValue(original.lastname, 'string'),
        salary: normalizeValue(original.salary, 'salary'),
        yearlyRentAmount: normalizeValue(original.yearlyRentAmount, 'salary'),
        email: normalizeValue(original.email, 'string'),
        phoneNumber: normalizeValue(original.phoneNumber, 'string'),
        bankId: normalizeValue(original.bankId, 'string'),
        accountNumber: normalizeValue(original.accountNumber, 'string'),
      };

      if (
        normalizedCurrent.firstname !== normalizedOriginal.firstname ||
        normalizedCurrent.lastname !== normalizedOriginal.lastname ||
        normalizedCurrent.salary !== normalizedOriginal.salary ||
        normalizedCurrent.yearlyRentAmount !== normalizedOriginal.yearlyRentAmount ||
        normalizedCurrent.email !== normalizedOriginal.email ||
        normalizedCurrent.phoneNumber !== normalizedOriginal.phoneNumber ||
        normalizedCurrent.bankId !== normalizedOriginal.bankId ||
        normalizedCurrent.accountNumber !== normalizedOriginal.accountNumber
      ) {
        hasAnyChanges = true;
        break;
      }
    }

    setHasChanges(hasAnyChanges);
  }, [originalData, normalizeValue]);

  const handleSubmitClick = useCallback(() => {
    if (!tableRef.current) return;

    // Clear all error cells
    Array.prototype.forEach.call(
      document.getElementsByClassName('error-cell'),
      (el) => {
        el.classList.remove('error-cell');
        el.removeAttribute('title');
      },
    );

    const data = tableRef.current.getData() || [];
    const updates: Array<{ id: string } & Partial<Employee>> = [];

    for (let i = 0; i < data.length; i += 1) {
      const [
        id,
        firstname,
        lastname,
        salary,
        yearlyRentAmount,
        email,
        phoneNumber,
        bankId,
        accountNumber,
      ] = data[i];

      if (!id) continue;

      const original = originalData.find((orig) => orig.id === id);
      if (!original) continue;

      // Build update object with only changed fields
      const update: any = { id };

      const normalizedCurrent = {
        firstname: normalizeValue(firstname, 'string'),
        lastname: normalizeValue(lastname, 'string'),
        salary: normalizeValue(salary, 'salary'),
        yearlyRentAmount: normalizeValue(yearlyRentAmount, 'salary'),
        email: normalizeValue(email, 'string'),
        phoneNumber: normalizeValue(phoneNumber, 'string'),
        bankId: normalizeValue(bankId, 'string'),
        accountNumber: normalizeValue(accountNumber, 'string'),
      };

      const normalizedOriginal = {
        firstname: normalizeValue(original.firstname, 'string'),
        lastname: normalizeValue(original.lastname, 'string'),
        salary: normalizeValue(original.salary, 'salary'),
        yearlyRentAmount: normalizeValue(original.yearlyRentAmount, 'salary'),
        email: normalizeValue(original.email, 'string'),
        phoneNumber: normalizeValue(original.phoneNumber, 'string'),
        bankId: normalizeValue(original.bankId, 'string'),
        accountNumber: normalizeValue(original.accountNumber, 'string'),
      };

      if (normalizedCurrent.firstname !== normalizedOriginal.firstname) {
        update.firstname = normalizedCurrent.firstname;
      }
      if (normalizedCurrent.lastname !== normalizedOriginal.lastname) {
        update.lastname = normalizedCurrent.lastname;
      }
      if (normalizedCurrent.salary !== normalizedOriginal.salary) {
        update.salary = normalizedCurrent.salary;
      }
      if (normalizedCurrent.yearlyRentAmount !== normalizedOriginal.yearlyRentAmount) {
        update.yearlyRentAmount = normalizedCurrent.yearlyRentAmount;
      }
      if (normalizedCurrent.email !== normalizedOriginal.email) {
        update.email = normalizedCurrent.email;
      }
      if (normalizedCurrent.phoneNumber !== normalizedOriginal.phoneNumber) {
        update.phoneNumber = normalizedCurrent.phoneNumber;
      }

      const payoutMethodMetaChanged =
        normalizedCurrent.bankId !== normalizedOriginal.bankId ||
        normalizedCurrent.accountNumber !== normalizedOriginal.accountNumber;

      if (payoutMethodMetaChanged) {
        update.payoutMethodMeta = {
          bankId: normalizedCurrent.bankId || undefined,
          accountNumber: normalizedCurrent.accountNumber || undefined,
        };
      }

      // Only add if there are changes (more than just id)
      if (Object.keys(update).length > 1) {
        updates.push(update);
      }
    }

    if (updates.length === 0) {
      toast.info('No changes to save');
      return;
    }

    setIsSubmitting(true);
    $api.employee
      .updateBulkEmployees({ employees: updates })
      .then(() => {
        toast.success('Employees updated successfully.');
        router.push('/employees');
      })
      .catch((err) => {
        Util.onNonAuthError(err, (httpError) => {
          if (httpError.status === 422) {
            const errors = (httpError.errors as unknown) as Record<
              string,
              Record<string, string>
            >;
            Object.keys(errors).forEach((index) => {
              const idx = parseInt(index, 10);
              if (!isNaN(idx) && data[idx]) {
                Object.keys(errors[index]).forEach((name) => {
                  setCellError(getColumnIndex(name), idx, errors[index][name]);
                });
              }
            });
          }
          toast.error(httpError.message);
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }, [originalData, normalizeValue, router, getColumnIndex, setCellError]);

  // Initialize jspreadsheet
  useEffect(() => {
    if (
      loading ||
      loadingData ||
      !sheetRef.current ||
      employees.length === 0 ||
      banks.length === 0
    ) {
      return;
    }

    // @ts-ignore
    if (sheetRef.current && !sheetRef.current.jspreadsheet) {
      const ref = sheetRef.current;
      const jspreadsheet = require('jspreadsheet-ce');

      // Transform filtered employees to spreadsheet data format
      const spreadsheetData = filteredEmployees.map((emp) => {
        const payoutMetaData = (emp.payoutMethodMeta as any) || {};
        return [
          emp.id, // ID (read-only)
          emp.firstname || '',
          emp.lastname || '',
          emp.salary || 0,
          emp.yearlyRentAmount || 0,
          emp.email || '',
          emp.phoneNumber || '',
          payoutMetaData.bankId || '',
          payoutMetaData.accountNumber || '',
          payoutMetaData.accountName || '',
        ];
      });

      const options: JOptions = {
        data: spreadsheetData,
        tableOverflow: true,
        tableWidth: '100%',
        tableHeight: 'auto',
        contextMenu: () => null,
        minDimensions: [10, filteredEmployees.length] as [number, number], // Fixed dimensions
        allowInsertRow: false,
        allowDeleteRow: false,
        columns: [
          { type: 'text', title: 'ID', width: 100, readOnly: true },
          { type: 'text', title: 'First Name', width: 135 },
          { type: 'text', title: 'Last Name', width: 135 },
          {
            type: 'numeric',
            title: 'Salary',
            width: 135,
            mask: 'N #,##.00',
            decimal: '.',
          },
          {
            type: 'numeric',
            title: 'Yearly Rent Amount',
            width: 135,
            mask: 'N #,##.00',
            decimal: '.',
          },
          { type: 'text', title: 'Email', width: 165 },
          {
            type: 'text',
            title: 'Phone (optional)',
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
        ],
        onchange(instance, cell, columnIndex, rowIndex, value) {
          cell.classList.remove('error-cell');
          cell.removeAttribute('title');

          // Check for changes after any edit
          setTimeout(() => {
            checkForChanges();
          }, 0);

          // Handle bank and account number changes
          if ([7, 8].includes(+columnIndex)) {
            payoutMetaRef.current[rowIndex] = {
              ...(payoutMetaRef.current[rowIndex] || {}),
              rowIndex,
              [+columnIndex === 7 ? 'bankId' : 'accountNumber']: value,
            };
            const { accountNumber, bankId } = payoutMetaRef.current[rowIndex];

            // Clear account name if either field is cleared
            if (!accountNumber || !bankId) {
              tableRef.current?.setValueFromCoords(9, +rowIndex, '', true);
              return;
            }

            if (accountNumber && bankId) {
              const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(
                bankId as string,
              );
              if (!isValidObjectId) {
                $api.payout
                  .getSupportedBanks(country?.id, { limit: 1, search: bankId })
                  .then(({ data }) => {
                    if (data.length) {
                      tableRef.current?.setValueFromCoords(
                        7,
                        +rowIndex,
                        data[0].id,
                        true,
                      );
                    }
                  })
                  .catch(() => {
                    tableRef.current?.setValueFromCoords(7, +rowIndex, '', true);
                  });
                return;
              }
              validateAccountDetails(bankId as string, accountNumber as string)
                .then((res) => {
                  if (res) {
                    tableRef.current?.setValueFromCoords(
                      9,
                      +rowIndex,
                      (res as { accountName: string }).accountName,
                      true,
                    );
                  }
                })
                .catch(() => {
                  setCellError(
                    8,
                    +rowIndex,
                    'unable to resolve account details',
                  );
                  setCellError(9, +rowIndex, 'invalid account details');
                });
            }
          }
        },
        oninsertrow: () => false, // Prevent row insertion
        ondeleterow: () => false, // Prevent row deletion
        showIndex: () => false,
      };

      tableRef.current = jspreadsheet(ref, options);

      return () => {
        // @ts-ignore
        ref.jspreadsheet = null;
        return jspreadsheet.destroy(ref);
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    loading,
    loadingData,
    employees.length,
    banks.length,
    getColumnIndex,
    setCellError,
    validateAccountDetails,
    country,
    checkForChanges,
    filteredEmployees,
  ]);

  // Update spreadsheet when filtered employees change
  useEffect(() => {
    if (!tableRef.current || loading || loadingData || !tableRef.current.jspreadsheet) return;

    const spreadsheetData = filteredEmployees.map((emp) => {
      const payoutMetaData = (emp.payoutMethodMeta as any) || {};
      return [
         emp.id,
        emp.firstname || '',
        emp.lastname || '',
        emp.salary || 0,
        emp.yearlyRentAmount || 0,
        emp.email || '',
        emp.phoneNumber || '',
        payoutMetaData.bankId || '',
        payoutMetaData.accountNumber || '',
        payoutMetaData.accountName || '',
      ];
    });

    // Update dimensions and data
    if (spreadsheetData.length > 0) {
      tableRef.current.setData(spreadsheetData);
      tableRef.current.setDimensions([10, filteredEmployees.length]);
      checkForChanges();
    }
  }, [filteredEmployees, loading, loadingData, checkForChanges]);

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
    handleSubmitClick,
    isSubmitting,
    hasChanges,
    loading: loading || loadingData,
    sheetRef,
    searchQuery,
    setSearchQuery,
  };
};
