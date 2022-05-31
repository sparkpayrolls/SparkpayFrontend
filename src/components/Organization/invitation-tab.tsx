import classNames from 'classnames';
import type { NextPage } from 'next';
import { TableLayout } from '@/components/Table/table-layout.component';
import { TableV2 } from '@/components/Table/Table.component';
import { StatusChip } from '../StatusChip/status-chip.component';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { Pagination } from '../Pagination/pagination.component';
import { useCallback, useEffect, useState } from 'react';
import { Company, Country, Invite, PaginationMeta, Role } from 'src/api/types';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Identity } from '../Identity/identity.component';
import { TableEmptyState } from '../EmptyState/table-emptystate.component';
import { useAppDispatch } from 'src/redux/hooks';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';

const InvitationTab: NextPage = () => {
  const [{ data: invites, meta }, setInvites] = useState({
    data: [] as Invite[],
    meta: {} as PaginationMeta,
  });
  const [loading, setLoading] = useState(false);
  const [lockTableHeight, setLockTableHeight] = useState(false);
  const [params, setParams] = useState({} as Record<string, any>);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const tableClassName = classNames('organisation__invitation-table', {
    'invitation-table--lock': lockTableHeight,
  });

  const getInvites = useCallback(async () => {
    try {
      const invites = await $api.admin.getInvites(params);
      setInvites((i) => invites as typeof i);
    } catch (error) {
      const httpError = error as HttpError;
      toast.error(httpError.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const getActionHandler = useCallback(
    (action: 'reject' | 'accept', token: string) => {
      return async () => {
        try {
          setLoading(false);
          switch (action) {
            case 'accept':
              await $api.admin.acceptInvitation(token);
              refreshCompanies(dispatch);
              break;
            case 'reject':
              await $api.admin.rejectInvitation(token);
          }

          getInvites();
          toast.success(`invitation ${action}ed successfully.`);
        } catch (error) {
          const httpError = error as HttpError;
          if (httpError.status === 400) {
            getInvites();
          }
          toast.error(httpError.message);
        } finally {
          setLoading(false);
        }
      };
    },
    [dispatch, getInvites],
  );

  useEffect(() => {
    getInvites();
  }, [getInvites]);

  useEffect(() => {
    const lockTableHeight = () => {
      if (window.document.body.scrollTop >= 189) {
        setLockTableHeight(true);
      } else {
        setLockTableHeight(false);
      }
    };

    window.document.body.addEventListener('scroll', lockTableHeight);

    return () => {
      window.document.body.removeEventListener('scroll', lockTableHeight);
    };
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const { action, inviteToken: token, ...others } = router.query;
      if (['accept', 'reject'].includes(action as string)) {
        const url = stringifyUrl({
          url: router.pathname,
          query: others,
        });
        getActionHandler(action as 'accept', token as string)();
        router.push(url);
      }
    }
  }, [router, getActionHandler]);

  return (
    <>
      <div>
        <p className="table-component__table-title">
          {meta.total} Invitation{meta.total > 1 && 's'}
        </p>
        <div className={tableClassName}>
          <TableLayout>
            <TableV2 loading={loading}>
              <thead>
                <tr>
                  <th>Organization</th>
                  <th>Role</th>
                  <th>Email Adress</th>
                  <th>Country</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {invites.map((invite) => {
                  const company = invite.company as Company;
                  const role = invite.role as Role;
                  const country = company.country as Country;

                  return (
                    <tr key={invite.id}>
                      <td>
                        <Identity
                          image={company.logo}
                          name={company.name}
                          initial={company.name[0]}
                          className="company-identity"
                        />
                      </td>
                      <td>{role.name || 'N/A'}</td>
                      <td>{company.email}</td>
                      <td>{country.name}</td>
                      <td>
                        <span className="d-flex justify-content-space-between align-items-center">
                          {invite.status && (
                            <StatusChip status={invite.status} />
                          )}
                          {invite.status === 'Pending' && (
                            <KebabMenu
                              items={[
                                {
                                  value: 'Accept',
                                  action: getActionHandler(
                                    'accept',
                                    invite.token,
                                  ),
                                },
                                {
                                  value: 'Decline',
                                  action: getActionHandler(
                                    'reject',
                                    invite.token,
                                  ),
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
          {meta.total < 1 && (
            <TableEmptyState
              text={
                loading
                  ? 'Getting invitations'
                  : 'Your invitations will appear here'
              }
            />
          )}
          <div className="invitation-table--lock__pagination">
            <Pagination meta={meta} refresh={setParams} />
          </div>
        </div>
      </div>
    </>
  );
};

export default InvitationTab;
