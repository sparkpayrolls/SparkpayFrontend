import NiceModal from '@ebay/nice-modal-react';
import { useCallback, useEffect, useState } from 'react';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { StatusChip } from '../StatusChip/status-chip.component';
import { SingleDetail } from './single-detail.component';
import { CreateEmployeeGroupModal } from '../Modals/CreateEmployeeGroupModal.component';
import { Group } from 'src/api/types';
import { NotFound } from '../Misc/not-found.component';
import { useAppSelector } from 'src/redux/hooks';
import { Util } from 'src/helpers/util';
import { useRouter } from 'next/router';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { GroupEmployees } from '../Group/group-employees.component';
import { IF } from '../Misc/if.component';

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
  const [loading, setLoading] = useState(false);

  const getGroup = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
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
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    getGroup();
  }, [getGroup, administrator]);

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
                  loading={loading}
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
                  loading={loading}
                />
              </div>
              <div>
                <SingleDetail
                  title="Status"
                  details={<StatusChip status={(group as Group)?.status} />}
                  loading={loading}
                />
              </div>
              <div>
                <SingleDetail
                  title="Date Created"
                  details={<DateTimeChip date={(group as Group)?.createdAt} />}
                  loading={loading}
                />
              </div>
            </div>
            <IF condition={(group as Group)?.description}>
              <hr />
              <div className="group-details__group-details-flex-body">
                <div className="full-width">
                  <SingleDetail
                    title="Description"
                    details={(group as Group)?.description}
                    loading={loading}
                  />
                </div>
              </div>
            </IF>
          </div>

          {/* add employee section */}

          <div className="mt-1">
            <div className="group-details__add-employee-section">
              <GroupEmployees groupId={groupId} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
