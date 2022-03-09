import Image from 'next/image';
import NiceModal from '@ebay/nice-modal-react';
import { useCallback, useEffect, useState } from 'react';
import removeicon from '../../../public/svgs/remove-icon.svg';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { EmployeeAutocompleteForm } from '../Form/employee-autocomplete.form';
import { StatusChip } from '../StatusChip/status-chip.component';
import { SingleDetail } from './single-detail.component';
import { CreateEmployeeGroupModal } from '../Modals/CreateEmployeeGroupModal.component';
import { Container } from '../Shared/container.component';
import { Group, EmployeeGroup, Employee } from 'src/api/types';
import { NotFound } from '../Misc/not-found.component';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from 'src/helpers/util';
import { useRouter } from 'next/router';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';
import { $api } from 'src/api';

interface IGroupDetails {
  editHandler?: {
    edit: boolean;
    // eslint-disable-next-line no-unused-vars
    setEdit(edit: boolean): any;
  };
}

export const GroupDetails = (props: IGroupDetails) => {
  const { editHandler } = props;
  const administrator = useAppSelector((state) => state.administrator);
  const router = useRouter();
  const groupId = router.query.id as string;
  const [group, setGroup] = useState<Group | 404>();
  const [employees, setEmployees] = useState<EmployeeGroup[]>([]);
  const [loading, setLoading] = useState({ group: false, employees: false });

  const getGroup = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading((i) => ({ ...i, group: true }));
      const group = await $api.employee.getEmployeeGroup(groupId);
      setGroup(group);
    } catch (error) {
      const httpError = error as HttpError;
      if (httpError.status === 404) {
        setGroup(404);
        return;
      }

      toast.error(httpError.message);
    } finally {
      setLoading((i) => ({ ...i, group: false }));
    }
  }, [groupId]);

  const getEmployees = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading((i) => ({ ...i, employees: true }));
      const { data: employees } = await $api.group.getGroupEmployees(groupId, {
        all: true,
      });
      setEmployees(employees);
    } catch (error) {
      const httpError = error as HttpError;
      toast.error(`error getting employees - ${httpError.message}`);
    } finally {
      setLoading((i) => ({ ...i, employees: false }));
    }
  }, [groupId]);

  useEffect(() => {
    getGroup();
    getEmployees();
  }, [getGroup, getEmployees, administrator]);

  useEffect(() => {
    if (editHandler) {
      const { edit, setEdit } = editHandler;
      if (edit && group && group !== 404) {
        setEdit(false);
        NiceModal.show(CreateEmployeeGroupModal, {
          id: group?.id,
          initialValues: {
            name: group?.name,
            description: group?.description || '',
            commonSalary: (group?.meta as any)?.commonSalary || '',
          },
        }).then(() => {
          getGroup();
        });
      }
    }
  }, [editHandler, group, getGroup]);

  const addEmployee = async (id: string) => {
    try {
      setLoading((i) => ({ ...i, employees: true }));
      await $api.employee.addEmployeesToGroup(groupId, [id]);
      await getEmployees();
      toast.success('employee added successfully.');
    } catch (error) {
      const httpError = error as HttpError;
      toast.error(httpError.message);
    } finally {
      setLoading((i) => ({ ...i, employees: false }));
    }
  };

  const removeEmployee = async (id: string) => {
    try {
      setLoading((i) => ({ ...i, employees: true }));
      await $api.employee.removeEmployeesFromGroup(groupId, [id]);
      await getEmployees();
      toast.success('employee removed successfully.');
    } catch (error) {
      const httpError = error as HttpError;
      toast.error(httpError.message);
    } finally {
      setLoading((i) => ({ ...i, employees: false }));
    }
  };

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  return (
    <div className="group-details__group-details-property">
      {group === 404 && <NotFound message="Group not found" />}
      {group !== 404 && (
        <>
          <div className="group-details__group-details-property-section">
            <div className="group-details__group-details-flex-body">
              <div>
                <SingleDetail
                  title="Group Name"
                  details={(group as Group)?.name}
                  loading={loading.group}
                />
              </div>
              <div>
                <SingleDetail
                  title="Common Salary"
                  details={
                    (((group as Group)?.meta as any)?.commonSalary &&
                      `${currency} ${Util.formatMoneyNumber(
                        ((group as Group)?.meta as any)?.commonSalary,
                      )}`) ||
                    'N/A'
                  }
                  loading={loading.group}
                />
              </div>
              <div>
                <SingleDetail
                  title="Status"
                  details={<StatusChip status={(group as Group)?.status} />}
                  loading={loading.group}
                />
              </div>
              <div>
                <SingleDetail
                  title="Date Created"
                  details={<DateTimeChip date={(group as Group)?.createdAt} />}
                  loading={loading.group}
                />
              </div>
            </div>
            <hr />
            <div className="group-details__group-details-flex-body">
              <div className="full-width">
                <SingleDetail
                  title="Description"
                  details={(group as Group)?.description}
                  loading={loading.group}
                />
              </div>
            </div>
          </div>

          {/* add employee section */}

          <div className="group-details__group-details-property-section">
            <div className="group-details__add-employee-section">
              <div className="group-details__employee-header">
                <p className="group-details__employee-number">
                  {employees.length} Employee{employees.length !== 1 && 's'}
                </p>
              </div>
              <Container
                loading={loading.employees}
                showContent
                className="group-details__parent-container"
              >
                <EmployeeAutocompleteForm
                  onSelect={(employee) => addEmployee(employee.id)}
                  clearOnSelect
                />

                <div className="items">
                  {employees.map((groupEmloyee) => {
                    const employee = groupEmloyee.employee as Employee;
                    if (!employee) return null;

                    return (
                      <div
                        className="group-details__user"
                        key={groupEmloyee.id}
                      >
                        <p className="group-details__name">
                          {employee.firstname} {employee.lastname}
                        </p>
                        <div
                          onClick={() => removeEmployee(employee.id)}
                          className="group-details__image-container"
                        >
                          <Image
                            src={removeicon}
                            className="group-details__remove-icon"
                            alt="group-details-image"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Container>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
