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

interface IEmployeeGroup {
  refreshList?: any;
}

export const EmployeeGroup = (props: IEmployeeGroup) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [params, setParams] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const administrator = useAppSelector((state) => state.administrator);

  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

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
          return (
            <div className="group-card" key={group.id}>
              <div className="group-card__header">
                <p>
                  <Link href="/employees/group-details">
                    <a>{group.name}</a>
                  </Link>
                </p>

                <button>
                  <KebabMenu
                    icon={GroupCardMoreIcon}
                    items={[
                      { value: 'View' },
                      { value: 'Delete' },
                      { value: 'Deactivate' },
                    ]}
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
