import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import {
  Invite,
  InviteTypeStatus,
  PaginationMeta,
  Role,
  User,
} from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { TableEmptyState } from '../EmptyState/table-emptystate.component';
import { Identity } from '../Identity/identity.component';
import { IKebabItem, KebabMenu } from '../KebabMenu/KebabMenu.component';
import { confirmation } from '../Modals/ConfirmationModal.component';
import { Pagination } from '../Pagination/pagination.component';
import { StatusChip } from '../StatusChip/status-chip.component';
import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';

export type IInvitationsRef = {
  refreshInvitations(): void;
};

type IInvitations = {
  // eslint-disable-next-line no-unused-vars
  getRef?(ref: IInvitationsRef): any;
};

export const Invitations = (props: IInvitations) => {
  const { getRef } = props;
  const administrator = useAppSelector((state) => state.administrator);
  const [invitations, setInvitations] = useState<Invite[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [params, setParams] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const getInvitations = useCallback(async () => {
    try {
      setLoading(true);
      const { data, meta } = await $api.admin.getInvitations(params);
      setInvitations(data);
      setMeta(meta);
    } catch (error) {
      const httpError = error as HttpError;
      if ([401, 403].includes(httpError.status)) {
        toast.error(httpError.message);
      }
    } finally {
      setLoading(false);
    }
  }, [params]);

  const onDelete = (id: string) => {
    return async () => {
      const shouuldDelete = await confirmation({
        title: 'Delete Invitation',
        text: 'Are you sure you want to permanently delete this invitation?',
      });
      if (!shouuldDelete) {
        return;
      }
      try {
        setLoading(true);
        setInvitations(invitations.filter((i) => i.id !== id));
        await $api.admin.deleteInvitation(id);
        toast.success('Invitation deleted successfully');
      } catch (error) {
        const httpError = error as HttpError;
        if ([401, 403].includes(httpError.status)) {
          toast.error(httpError.message);
        }
      } finally {
        setLoading(false);
      }
    };
  };

  const onWithdraw = (id: string) => {
    return async () => {
      try {
        setLoading(true);
        setInvitations(
          invitations.map((i) => {
            if (i.id === id) {
              i.status = 'Withdrawn';
            }
            return i;
          }),
        );
        await $api.admin.withdrawInvitation(id);
        toast.success('Invitation withdrawn successfully');
      } catch (error) {
        const httpError = error as HttpError;
        if ([401, 403].includes(httpError.status)) {
          toast.error(httpError.message);
        }
      } finally {
        setLoading(false);
      }
    };
  };

  useEffect(() => {
    if (getRef) {
      getRef({ refreshInvitations: getInvitations });
    }
  }, [getInvitations, getRef]);

  useEffect(() => {
    getInvitations();
  }, [getInvitations, administrator]);

  return (
    <div className="invitations">
      <TableLayout
        title={`${meta?.total || 0} Invitation${meta?.total === 1 ? '' : 's'}`}
        searchPlaceholder="Search by name"
        onSearch={(search) => setParams({ ...params, search })}
      >
        <TableV2 className="invitations__table" loading={loading}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((invitation) => {
              const user = invitation.user as User;
              const role = invitation.role as Role;
              const items: IKebabItem[] = [];
              if (invitation.status !== 'Pending') {
                items.push({
                  value: 'Delete',
                  action: onDelete(invitation.id),
                });
              } else {
                items.push({
                  value: 'Withdraw',
                  action: onWithdraw(invitation.id),
                });
              }

              return (
                <tr key={invitation.id}>
                  <td>
                    <Identity
                      image={user?.avatar}
                      name={
                        user
                          ? `${user.firstname} ${user.lastname}`
                          : invitation.name
                      }
                      initial={(user?.firstname || invitation.name)?.slice(
                        0,
                        1,
                      )}
                    />
                  </td>
                  <td>{user?.email || invitation.email}</td>
                  <td>{role?.name}</td>
                  <td>
                    <StatusChip
                      status={invitation.status as InviteTypeStatus}
                    />
                  </td>
                  <td>
                    <span className="invitations__last-table-column">
                      <DateTimeChip date={invitation.createdAt} />
                      {!!items.length && <KebabMenu items={items} />}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableV2>
      </TableLayout>
      {(meta?.total || 0) < 1 && (
        <TableEmptyState
          text={loading ? 'Getting data...' : 'Invitations will appear here'}
        />
      )}

      <div className="roles__pagination">
        <Pagination meta={meta} refresh={setParams} />
      </div>
    </div>
  );
};
