import Link from 'next/link';
import { GroupCardMoreIcon } from '../svg';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { StatusChip } from '../StatusChip/status-chip.component';
import { SearchForm } from '../Form/search.form';
import { Pagination } from '../Pagination/pagination.component';
import { Container } from '../Shared/container.component';
import { TableEmptyState } from '../EmptyState/table-emptystate.component';
import { useCallback, useState, useEffect, ChangeEvent } from 'react';
import { Group, PaginationMeta } from 'src/api/types';
import { toast } from 'react-toastify';
import { HttpError } from 'src/api/repo/http.error';
import { $api } from 'src/api';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';
import { confirmation } from '../Modals/ConfirmationModal.component';

interface IEmployeeGroup {
  refreshList?: any;
}

export const EmployeeGroup = (props: IEmployeeGroup) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [params, setParams] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const administrator = useAppSelector((state) => state.administrator);

  const getGroups = useCallback(async () => {
    try {
      setLoading(true);
      const { data, meta } = await $api.employee.getEmployeeGroups(params);
      setGroups(data);
      setMeta(meta);
    } catch (error) {
      const httpError = error as HttpError;
      toast.error(httpError.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const search = useCallback(
    Util.debounce((event: ChangeEvent<HTMLInputElement>) => {
      setParams((params) => ({ ...params, search: event.target.value }));
    }, 500),
    [],
  );

  useEffect(() => {
    getGroups();
  }, [getGroups, administrator, props.refreshList]);

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);
  const hasWriteAccess = Util.canActivate(
    [['Employee', 'write']],
    administrator,
  );

  const getStatusToggleHandler = (
    id: string,
    status: 'active' | 'disabled',
  ) => {
    return async () => {
      try {
        setLoading(true);
        await $api.employee.updateEmployeeGroup(id, { status });
        getGroups();
        toast.success('group status successfully updated');
      } catch (error) {
        const httpError = error as HttpError;
        toast.error(httpError.message);
      } finally {
        setLoading(false);
      }
    };
  };

  const getDeleteHandler = (id: string) => {
    return async () => {
      const shouldDelete = await confirmation({
        title: 'Delete employee group',
        text: 'Are you sure you want to permanently delete this group?',
      });
      if (shouldDelete) {
        try {
          setLoading(true);
          await $api.employee.deleteEmployeeGroup(id);
          getGroups();
          toast.success('group deleted successfully.');
        } catch (error) {
          const httpError = error as HttpError;
          toast.error(httpError.message);
        } finally {
          setLoading(false);
        }
      }
    };
  };

  return (
    <div className="employee-group-tab">
      <div className="employee-group-tab__header">
        <p>
          {meta?.total} Group{(meta?.total || 0) !== 1 && 's'}
        </p>

        <div>
          <SearchForm placeholder="Search by group name" onChange={search} />
        </div>
      </div>

      <Container
        loading={loading}
        showContent
        className="employee-group-tab__cards"
      >
        {!groups.length && (
          <TableEmptyState
            text={
              loading
                ? 'Getting employee groups...'
                : 'Your employee groups will appear here'
            }
          />
        )}
        {groups.map((group) => {
          const menuItems = [
            { value: 'View', href: `/employees/groups/${group.id}` },
            {
              value: 'Delete',
              writeAccess: true,
              action: getDeleteHandler(group.id),
            },
            {
              value: 'Disable',
              writeAccess: true,
              action: getStatusToggleHandler(group.id, 'disabled'),
            },
            {
              value: 'Enable',
              writeAccess: true,
              action: getStatusToggleHandler(group.id, 'active'),
            },
          ];
          if (group.status === 'active') {
            menuItems.splice(3, 1);
          } else {
            menuItems.splice(2, 1);
          }

          return (
            <div className="group-card" key={group.id}>
              <div className="group-card__header">
                <p>
                  <Link href={`/employees/groups/${group.id}`}>
                    <a>{group.name}</a>
                  </Link>
                </p>

                <button>
                  <KebabMenu
                    icon={GroupCardMoreIcon}
                    items={menuItems.filter(
                      (item) => !item.writeAccess || hasWriteAccess,
                    )}
                  />
                </button>
              </div>

              <div className="group-card__date">
                <span className="group-card__date__title">Date Created</span>
                <DateTimeChip date={group.createdAt} />
              </div>

              <div className="group-card__footer">
                <StatusChip status={group.status} />

                {(group.meta as any)?.commonSalary && (
                  <span className="group-card__common-salary">
                    <span className="group-card__common-salary__title">
                      Common Salary
                    </span>

                    <span className="group-card__common-salary__amount">
                      {currency}{' '}
                      {Util.formatMoneyNumber(
                        (group.meta as any)?.commonSalary,
                      )}
                    </span>
                  </span>
                )}
              </div>
            </div>
          );
        })}

        <div className="employee-group-tab__cards__pagination">
          <Pagination refresh={setParams} meta={meta} />
        </div>
      </Container>
    </div>
  );
};
