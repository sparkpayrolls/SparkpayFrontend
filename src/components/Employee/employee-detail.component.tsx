import moment from 'moment';
import { useRouter } from 'next/router';
import NiceModal from '@ebay/nice-modal-react';
import { useCallback, useEffect, useState } from 'react';
import { Country, Employee, Group } from 'src/api/types';
import useApiCall from 'src/helpers/hooks/useapicall.hook';
import {
  getEmployeeEditSubmitHandler,
  getEmployeeMethod,
} from 'src/helpers/methods';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';
import { IF } from '../Misc/if.component';
import { NotFound } from '../Misc/not-found.component';
import { EditEmployeeDetailsModal } from '../Modals/EditDetailsModal.component';
import { SingleDetail } from './single-detail.component';

interface IEmployeeDetails {
  editHandler?: {
    edit: boolean;
    // eslint-disable-next-line no-unused-vars
    setEdit(edit: boolean): any;
  };
}

export const EmployeeDetail = (props: IEmployeeDetails) => {
  const { editHandler } = props;
  const router = useRouter();
  const administrator = useAppSelector((state) => state.administrator);
  const [eph, setEmployee] = useState<Employee>();
  const [notFound, setNotFound] = useState(false);
  const [load, apiCallStarted, apiCallDone] = useApiCall();

  const employeeId = router.query.id as string;
  const loading = load || !eph;
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const salary = Util.formatMoneyNumber(eph?.salary ?? 0);

  const getEmployee = useCallback(async () => {
    await getEmployeeMethod({
      employeeId,
      apiCallStarted,
      setEmployee,
      setNotFound,
      apiCallDone,
    })();
  }, [employeeId, apiCallDone, apiCallStarted]);

  useEffect(() => {
    getEmployee();
  }, [getEmployee, administrator]);

  useEffect(() => {
    if (editHandler) {
      const { edit, setEdit } = editHandler;
      if (edit && eph && !notFound) {
        setEdit(false);
        NiceModal.show(EditEmployeeDetailsModal, {
          administrator,
          employee: eph,
          onSubmit: getEmployeeEditSubmitHandler(employeeId, getEmployee),
        });
      }
    }
  }, [administrator, editHandler, employeeId, eph, getEmployee, notFound]);

  return (
    <>
      <IF condition={notFound}>
        <div className="employee-details__not-found">
          <NotFound message="Employee not found" />
        </div>
      </IF>
      <IF condition={!notFound}>
        <div className="employee-details__employee-settings-details">
          <div className="employee-details__employee-settings-flex">
            <div>
              <SingleDetail
                title="Name"
                details={`${eph?.firstname} ${eph?.lastname}`}
                loading={loading}
              />
            </div>
            <div>
              <SingleDetail
                title="Email Address"
                details={eph?.email}
                loading={loading}
              />
            </div>
            <div>
              <SingleDetail
                title="Group(s)"
                details={eph?.groups
                  ?.map((group) => (group.group as Group).name)
                  ?.join(', ')}
                loading={loading}
              />
            </div>
            <div>
              <SingleDetail
                title="Date Created"
                details={moment(eph?.createdAt).format('MMMM DD, YYYY')}
                loading={loading}
              />
            </div>
          </div>
          <hr />

          <div className="employee-details__employee-settings-flex">
            <div>
              <SingleDetail
                title="Salary Amount"
                details={`${currency} ${salary}`}
                loading={loading}
              />
            </div>
            <div>
              <SingleDetail
                title="Country"
                details={(eph?.country as Country)?.name}
                loading={loading}
              />
            </div>
          </div>
          <hr />
        </div>
      </IF>
    </>
  );
};
