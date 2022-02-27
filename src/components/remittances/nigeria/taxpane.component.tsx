import { Button } from '@/components/Button/Button.component';
import { TableEmptyState } from '@/components/EmptyState/table-emptystate.component';
import { EmployeeAutocompleteForm } from '@/components/Form/employee-autocomplete.form';
import { EditableField } from '@/components/Input/editable-field.component';
import { InputV2 } from '@/components/Input/Input.component';
import { NameValueInputGroup } from '@/components/Input/name-value.component';
import { Select } from '@/components/Input/select.component';
import { Pagination } from '@/components/Pagination/pagination.component';
import { Container } from '@/components/Shared/container.component';
import { TableLayout } from '@/components/Table/table-layout.component';
import { TableV2 } from '@/components/Table/Table.component';
import { Text } from '@/components/Typography/Text';
import { Radio, Space } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import {
  Employee,
  EmployeeTaxDetail,
  EmployeeTaxDetailPayload,
  NigerianTaxSettings,
  SetupTaxPayload,
  State,
} from 'src/api/types';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';

export const TaxPane = () => {
  const [settings, setSettings] = useState<NigerianTaxSettings | null>(null);
  const [errors, setErrors] = useState({ whTaxRate: '' });
  const [updateCallId, setUpdateCallId] = useState<Record<string, any>>({});
  const [states, setStates] = useState<State[] | null>(null);
  const [taxEmployees, setTaxEmployees] = useState<EmployeeTaxDetail[]>([]);
  const [employeePaginationMeta, setEmployeePaginationMeta] = useState<
    Record<string, any>
  >({});
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [employeeCurrentPageInfo, setEmployeeCurrentPageInfo] = useState({});
  const administrator = useAppSelector((state) => state.administrator);

  const getData = useCallback(() => {
    $api.remittance.nigeria.tax
      .getTaxSettings()
      .then((details) => {
        setSettings(details);
      })
      .catch(() => {
        /** ... */
      });
    $api.remittance.nigeria.tax
      .getTaxStates({ all: true })
      .then(({ data: states }) => {
        setStates(states);
      })
      .catch(() => {
        /** ... */
      });
  }, []);

  const getTaxEmployees = (query: Record<string, any>) => {
    setEmployeesLoading(true);
    $api.remittance.nigeria.tax
      .getEmployees(query)
      .then(({ data: taxEmployees, meta }) => {
        setTaxEmployees(taxEmployees);
        setEmployeePaginationMeta(meta || {});
      })
      .catch(() => {
        /** */
      })
      .finally(() => setEmployeesLoading(false));
  };

  const addEmployeeToTax = useCallback(
    (payload: EmployeeTaxDetailPayload) => {
      toast
        .promise(
          async () => {
            await $api.remittance.nigeria.tax.addEmployees({
              employeeDetails: [payload],
            });
            getTaxEmployees(employeeCurrentPageInfo);
          },
          {
            success: 'Employee details saved',
            pending: 'Saving employee details',
            error: 'Error saving employee details',
          },
          {
            position: 'bottom-left',
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
          },
        )
        .catch((e) => {
          toast.error(e.message);
        });
    },
    [employeeCurrentPageInfo],
  );

  const updateDetails = async (update: SetupTaxPayload) => {
    await toast
      .promise(
        async () => {
          const details = await $api.remittance.nigeria.tax.setupTax(update);

          setSettings(details);
        },
        {
          success: 'Changes saved',
          pending: 'Saving changes',
          error: 'Error saving changes',
        },
        {
          position: 'bottom-left',
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
        },
      )
      .catch((e) => {
        toast.error(e.message);
      });
  };

  const getRadioHandler = (name: string) => {
    return (e: any) => {
      if (settings) {
        const { value } = e.target;
        setSettings({ ...settings, [name]: value });
        updateDetails({ [name]: value });
      }
    };
  };

  const getInputHandler = (name: string) => {
    return (e: any) => {
      if (settings) {
        const { value } = e.target;
        setSettings({ ...settings, [name]: value });
        clearTimeout(updateCallId[name]);
        setUpdateCallId({
          ...updateCallId,
          [name]: setTimeout(updateDetails, 1000, { [name]: value }),
        });
      }
    };
  };

  const getEmployeeHandler = (
    name: string,
    employee: Employee,
    index: number,
  ) => {
    return (e: any) => {
      const { value } = e.target;
      const callName = `${employee.id}:${name}`;
      const clone = [...taxEmployees];

      (clone[index] as any)[name] = value;

      setTaxEmployees(clone);
      clearTimeout(updateCallId[callName]);
      setUpdateCallId({
        ...updateCallId,
        [callName]: setTimeout(() => {
          addEmployeeToTax({
            employee: employee.id,
            [name]: value,
          });
        }, 1000),
      });
    };
  };

  const deleteEmployee = (employee: EmployeeTaxDetail) => {
    return () => {
      toast
        .promise(
          async () => {
            await $api.remittance.nigeria.tax.deleteEmployee(employee.id);
          },
          {
            success: 'Employee removed',
            pending: 'Removing employee',
            error: 'Error removing employee',
          },
          {
            position: 'bottom-left',
          },
        )
        .then(() => {
          setTaxEmployees(taxEmployees.filter((e) => e.id !== employee.id));
        })
        .catch((error) => {
          toast.error(error.message);
        });
    };
  };

  const validateWhTaxRate = (e: any) => {
    setErrors({ ...errors, whTaxRate: '' });
    const { value } = e.target;
    const whTaxRate = +value;
    if (whTaxRate <= 0 || whTaxRate > 100) {
      setErrors({
        ...errors,
        whTaxRate: 'Should be greater than 0 and less than or equal to 100',
      });
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    getTaxEmployees(employeeCurrentPageInfo);
  }, [employeeCurrentPageInfo]);

  const salaryBreakdown = settings?.company?.salaryBreakdown || [];

  // Defaults....
  ['Basic:100', 'Housing:0', 'Transport:0'].forEach((item) => {
    const [name, value] = item.split(':');
    const breakdownExists = salaryBreakdown.some((s) =>
      s.name.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
    );
    if (!breakdownExists) {
      salaryBreakdown.push({ name, value: +value });
    }
  });
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  return (
    <Container className="tax-pane">
      <Container loading={!settings} className="tax-pane__settings">
        <Container>
          <Text text="Status" className="text__label" element="label" />
          <Radio.Group
            value={settings?.status || 'Disabled'}
            onChange={getRadioHandler('status')}
          >
            <Space direction="vertical">
              <Radio value="Disabled">Disabled</Radio>
              <Radio value="Calculate">Calculate</Radio>
              <Radio value="Deduct">Deduct</Radio>
              <Radio value="Remit">Remit</Radio>
            </Space>
          </Radio.Group>
        </Container>

        <Container>
          <Text text="Type" className="text__label" element="label" />
          <Radio.Group
            value={settings?.type || 'PAYE'}
            onChange={getRadioHandler('type')}
          >
            <Space direction="vertical">
              <Radio value="PAYE">PAYE</Radio>
              <Radio value="WITHHOLDING">Withholding Tax</Radio>
            </Space>
          </Radio.Group>
        </Container>

        <InputV2
          label="Withholding Tax Rate"
          value={settings?.whTaxRate}
          onChange={(e) => {
            validateWhTaxRate(e);
            if (settings) {
              const { value } = e.target;
              const whTaxRate = +value;
              if (whTaxRate > 0 && whTaxRate <= 100) {
                getInputHandler('whTaxRate')(e);
              }
            }
          }}
          onBlur={validateWhTaxRate}
          type="number"
          placeholder="Withholding Tax Rate"
          error={errors.whTaxRate}
        />

        <InputV2
          label="Tax ID"
          name="taxId"
          value={settings?.taxId}
          onChange={getInputHandler('taxId')}
          type="text"
          placeholder="Tax ID"
        />

        <InputV2
          label="Tax Office"
          name="taxOffice"
          value={settings?.taxOffice}
          onChange={getInputHandler('taxOffice')}
          type="text"
          placeholder="Tax Office"
        />

        <Select
          loading={!states}
          onChange={(v) => {
            if (settings && states) {
              const taxState = states.find((s) => s.id === v);
              if (taxState) {
                setSettings({ ...settings, taxState });
                clearTimeout(updateCallId['taxState']);
                setUpdateCallId({
                  ...updateCallId,
                  taxState: setTimeout(updateDetails, 1000, { taxState: v }),
                });
              }
            }
          }}
          defaultValue={settings?.taxState?.id}
          label="Tax State"
          showSearch
          optionFilterProp="children"
          placeholder="Tax State"
        >
          {states?.map((state) => {
            const { Option } = Select;

            return (
              <Option key={state.id} value={state.id}>
                {state.name}
              </Option>
            );
          })}
        </Select>

        <Container>
          <NameValueInputGroup
            label="Custom tax relief items"
            items={
              settings?.customTaxRelief?.map((c) => ({
                ...c,
                value: c.amount,
              })) || []
            }
            onChange={(e) => {
              e.target.value = e.target.value.map((v) => ({
                amount: v.value,
                name: v.name,
              })) as any;
              getInputHandler('customTaxRelief')(e);
            }}
            transformValue={(v: number) => {
              return `${currency} ${Util.formatMoneyNumber(+v || 0)}`;
            }}
          />
        </Container>

        <Container>
          <NameValueInputGroup
            label="Salary Breakdown"
            items={salaryBreakdown}
            transformValue={(v: number) => {
              return `${(+v).toFixed(1)}%`;
            }}
            readonly
          />
        </Container>
      </Container>

      <Container className="tax-pane__employee-list">
        <Container>
          <Text
            text="Add employee to Tax list"
            className="text__section-title"
            element="h6"
          />

          <EmployeeAutocompleteForm
            onSubmit={(e) => addEmployeeToTax({ employee: e.id })}
          />
        </Container>

        <Container>
          <Text
            text="Employees on Tax list"
            className="text__section-title"
            element="h6"
          />
          <Container className="tax-pane__table-container">
            <TableLayout>
              <TableV2 loading={employeesLoading}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Payee ID </th>
                    <th>Tax State</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {taxEmployees.map((taxEmployee, index) => {
                    const employee = taxEmployee.employee as Employee;

                    return (
                      <tr key={taxEmployee.id}>
                        <td className="px-17 col-12-5">
                          {employee.firstname} {employee.lastname}
                        </td>
                        <td className="col-25">
                          <EditableField
                            placeholder="Tax ID"
                            value={taxEmployee.taxId}
                            onChange={getEmployeeHandler(
                              'taxId',
                              employee,
                              index,
                            )}
                          />
                        </td>
                        <td className="col-25">
                          <Select
                            loading={!states}
                            showSearch
                            defaultValue={taxEmployee.taxState as string}
                            optionFilterProp="children"
                            placeholder="Tax State"
                            onChange={(value) => {
                              getEmployeeHandler(
                                'taxState',
                                employee,
                                index,
                              )({ target: { value } });
                            }}
                          >
                            {states?.map((state) => {
                              const { Option } = Select;

                              return (
                                <Option key={state.id} value={state.id}>
                                  {state.name}
                                </Option>
                              );
                            })}
                          </Select>
                        </td>
                        <td className="px-17 col-12-5">
                          <Button
                            label={
                              <>
                                <i className="fas fa-trash fa"></i>
                                &nbsp;{'Remove'}
                              </>
                            }
                            danger
                            size="small"
                            type="button"
                            onClick={deleteEmployee(taxEmployee)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </TableV2>
            </TableLayout>
            {taxEmployees.length < 1 && (
              <TableEmptyState
                className="tax-pane__table-container__empty-state"
                text={
                  employeesLoading
                    ? 'Getting data...'
                    : 'No employees on your Tax list'
                }
              />
            )}
            {employeePaginationMeta.pageCount > 1 && (
              <Container className="tax-pane__table-container__pagination">
                <Pagination
                  meta={employeePaginationMeta}
                  refresh={setEmployeeCurrentPageInfo}
                />
              </Container>
            )}
          </Container>
        </Container>
      </Container>
    </Container>
  );
};
