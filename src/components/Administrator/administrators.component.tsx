import NiceModal from '@ebay/nice-modal-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Administrator, PaginationMeta, Role, User } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { TableEmptyState } from '../EmptyState/table-emptystate.component';
import { Identity } from '../Identity/identity.component';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { confirmation } from '../Modals/ConfirmationModal.component';
import { CreateAdminModal } from '../Modals/CreateAdminModal.component';
import { Pagination } from '../Pagination/pagination.component';
import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';

export type IAdministratorsRef = {
  refreshAdministrators(): void;
};

type IAdministrators = {
  // eslint-disable-next-line no-unused-vars
  getRef?(ref: IAdministratorsRef): any;
};

export const Administrators = (props: IAdministrators) => {
  const { getRef } = props;
  const administrator = useAppSelector((state) => state.administrator);
  const [params, setParams] = useState({} as Record<string, any>);
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(false);

  const getAdministrators = useCallback(async () => {
    try {
      setLoading(true);
      const { data, meta } = await $api.admin.getAdministrators(params);
      setAdministrators(data);
      setMeta(meta);
    } catch (error) {
      const err = error as HttpError;
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const onEditAdministrator = useCallback(
    (admin: Administrator) => {
      return () => {
        const role = admin.role as Role;
        const user = admin.user as User;

        NiceModal.show(CreateAdminModal, {
          id: admin.id,
          initialValues: {
            role: role.id,
            user: user.id,
            email: user.email,
            name: `${user.firstname} ${user.lastname}`,
          },
        }).then(() => {
          getAdministrators();
        });
      };
    },
    [getAdministrators],
  );

  const onDeleteAdministrator = (id: string) => {
    return async () => {
      const canDelete = await confirmation({
        title: 'Delete Administrator',
        text: 'Are you sure you want to permanently delete this administrator?',
      });
      if (!canDelete) {
        return;
      }
      try {
        setLoading(true);
        setAdministrators(
          administrators.filter((administrator) => administrator.id !== id),
        );
        await $api.admin.deleteAdministrator(id);
        toast.success('Administrator deleted successfully');
        await getAdministrators();
      } catch (error) {
        const err = error as HttpError;
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
  };

  useEffect(() => {
    if (getRef) {
      getRef({ refreshAdministrators: getAdministrators });
    }
  }, [getAdministrators, getRef, administrator]);

  useEffect(() => {
    getAdministrators();
  }, [getAdministrators, administrator]);

  return (
    <div className="administrators">
      <TableLayout
        title={`${meta?.total || 0} Administrator${
          meta?.total === 1 ? '' : 's'
        }`}
        searchPlaceholder="Search by name"
        onSearch={(search) => setParams({ ...params, search })}
      >
        <TableV2 loading={loading} className="administrators__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email Address</th>
              <th>Role</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {administrators.map((admin) => {
              const user = admin.user as User;
              const role = admin.role as Role;

              return (
                <tr key={admin.id}>
                  <td>
                    <Identity
                      className="administrators__identity"
                      name={`${user.firstname} ${user.lastname}${
                        administrator?.id === admin.id ? ' (You)' : ''
                      }`}
                      image={user.avatar}
                      initial={user.firstname.slice(0, 1)}
                    />
                  </td>
                  <td>{user.email}</td>
                  <td>{admin.isRoot ? 'Owner' : role?.name}</td>
                  <td>
                    <span className="administrators__last-table-column">
                      <DateTimeChip date={admin.createdAt} />
                      {!admin.isRoot && admin.id !== administrator?.id && (
                        <KebabMenu
                          items={[
                            {
                              value: 'Edit',
                              action: onEditAdministrator(admin),
                            },
                            {
                              value: 'Delete',
                              action: onDeleteAdministrator(admin.id),
                            },
                          ]}
                        />
                      )}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </TableV2>
      </TableLayout>
      {administrators.length < 1 && (
        <TableEmptyState
          text={loading ? 'Loading data...' : 'Administrators will appear here'}
        />
      )}

      <div className="administrators__pagination">
        <Pagination meta={meta} refresh={setParams} />
      </div>
    </div>
  );
};
