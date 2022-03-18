import NiceModal from '@ebay/nice-modal-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { PaginationMeta, Permission, Role } from 'src/api/types';
import { useAppSelector } from 'src/redux/hooks';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { TableEmptyState } from '../EmptyState/table-emptystate.component';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { confirmation } from '../Modals/ConfirmationModal.component';
import { CreateRoleModal } from '../Modals/CreateRoleModal.component';
import { Pagination } from '../Pagination/pagination.component';
import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';

export type IRolesRef = {
  refreshRoles(): void;
};

type IRoles = {
  // eslint-disable-next-line no-unused-vars
  getRef?(ref: IRolesRef): any;
};

export const Roles = (props: IRoles) => {
  const { getRef } = props;
  const administrator = useAppSelector((state) => state.administrator);
  const [roles, setRoles] = useState<Role[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [params, setParams] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const getRoles = useCallback(async () => {
    try {
      setLoading(true);
      const { data, meta } = await $api.role.getCompanyRoles(params);
      setRoles(data);
      setMeta(meta);
    } catch (error) {
      const httpError = error as HttpError;
      if (![401, 403].includes(httpError.status)) {
        toast.error(httpError.message);
      }
    } finally {
      setLoading(false);
    }
  }, [params]);

  const onDelete = (id: string) => {
    return async () => {
      const shouldDelete = await confirmation({
        title: 'Delete Role',
        text: 'Are you sure you want to permanently delete this role?',
      });
      if (!shouldDelete) {
        return;
      }

      try {
        setLoading(true);
        setRoles(roles.filter((role) => role.id !== id));
        await $api.role.deleteRole(id);
        toast.success('Role deleted successfully');
        await getRoles();
      } catch (error) {
        const httpError = error as HttpError;
        if (![401, 403].includes(httpError.status)) {
          toast.error(httpError.message);
        }
      } finally {
        setLoading(false);
      }
    };
  };
  const onEditRole = (role: Role) => {
    return async () => {
      NiceModal.show(CreateRoleModal, {
        id: role.id,
        initialValues: {
          name: role.name,
          permissions: role.permissions.map((p) => (p as Permission).id),
        },
      }).then(() => {
        getRoles();
      });
    };
  };

  useEffect(() => {
    getRoles();
  }, [getRoles, administrator]);

  useEffect(() => {
    if (getRef) {
      getRef({ refreshRoles: getRoles });
    }
  }, [getRef, getRoles]);

  return (
    <div className="roles">
      <TableLayout
        title={`${meta?.total || 0} Role${meta?.total === 1 ? '' : 's'}`}
        searchPlaceholder="Search by name"
        onSearch={(search) => setParams({ ...params, search })}
      >
        <TableV2 className="roles__table" loading={loading}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Permissions</th>
              <th>No. of Users</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => {
              return (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  <td>
                    <span className="roles__permissions">
                      {role.permissions.map((p) => {
                        const permission = p as Permission;
                        const level = ['R'];
                        if (permission.level === 'write') {
                          level.push('W');
                        }

                        return (
                          <span key={permission.id}>
                            {permission.group}: {level.join(',')}
                          </span>
                        );
                      })}
                    </span>
                  </td>
                  <td>{role.userCount}</td>
                  <td>
                    <span className="roles__last-table-column">
                      <DateTimeChip date={role.createdAt} />
                      <KebabMenu
                        items={[
                          { value: 'Edit', action: onEditRole(role) },
                          { value: 'Delete', action: onDelete(role.id) },
                        ]}
                      />
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
          text={loading ? 'Getting data...' : 'Roles will appear here'}
        />
      )}

      <div className="roles__pagination">
        <Pagination meta={meta} refresh={setParams} />
      </div>
    </div>
  );
};
