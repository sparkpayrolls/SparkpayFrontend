import { DateTimeChip } from '@/components/DateTimeChip/date-time-chip';
import { TableEmptyState } from '@/components/EmptyState/table-emptystate.component';
import { KebabMenu } from '@/components/KebabMenu/KebabMenu.component';
import { confirmation } from '@/components/Modals/ConfirmationModal.component';
import { TaxGroupModal } from '@/components/Modals/TaxGroupModal.component';
import { Pagination } from '@/components/Pagination/pagination.component';
import { Container } from '@/components/Shared/container.component';
import { GroupCardMoreIcon } from '@/components/svg';
import { Text } from '@/components/Typography/Text';
import NiceModal from '@ebay/nice-modal-react';
import { Avatar, Tooltip } from 'antd';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import {
  Employee,
  Group,
  NigerianTaxGroupMeta,
  PaginationMeta,
} from 'src/api/types';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';

export type ITaxGroupRef = {
  refreshGroups(): Promise<void>;
};

export type ITaxGroup = {
  getRef?(_ref: ITaxGroupRef): unknown;
};

export const TaxGroup = (props: ITaxGroup) => {
  const { getRef } = props;
  const administrator = useAppSelector((state) => state.administrator);
  const [groups, setGroups] = useState<Group<NigerianTaxGroupMeta>[]>([]);
  const [groupsMeta, setGroupsMeta] = useState<PaginationMeta>();
  const [groupsParams, setGroupParams] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(false);

  const getGroups = useCallback(async () => {
    try {
      setLoading(true);
      const { data, meta } = await $api.remittance.nigeria.tax.getTaxGroups(
        groupsParams,
      );

      setGroups(data);
      setGroupsMeta(meta);
    } catch (error) {
      Util.onNonAuthError(error, (httpError) => {
        toast.error(httpError.message);
      });
    } finally {
      setLoading(false);
    }
  }, [groupsParams]);

  useEffect(() => {
    getGroups();
  }, [getGroups, administrator]);

  useEffect(() => {
    if (getRef) {
      getRef({ refreshGroups: getGroups });
    }
  }, [getGroups, getRef]);

  const menuItems = (group: Group<NigerianTaxGroupMeta>) => [
    { value: 'View', href: `/remittances/nigeria/taxes/groups/${group.id}` },
    {
      value: 'Edit',
      action() {
        NiceModal.show(TaxGroupModal, {
          id: group.id,
          initialValues: group,
        }).then(getGroups);
      },
    },
    {
      value: 'Delete',
      async action() {
        const shouldDelete = await confirmation({
          text: 'Are you sure you want to permanently delete this group?',
          title: 'Delete Group',
        });
        if (!shouldDelete) {
          return;
        }

        try {
          setLoading(true);
          setGroups(groups.filter((g) => g.id !== group.id));
          await $api.remittance.nigeria.tax.deleteTaxGroup(group.id);
          toast.success('Group deleted successfully');
        } catch (error) {
          Util.onNonAuthError(error, (httpError) => {
            toast.error(httpError.message);
          });
        } finally {
          setLoading(false);
        }
      },
    },
  ];

  return (
    <Container className="tax-group" loading={loading} showContent>
      <Text className="tax-group__page-title " element="h2">{`${
        groupsMeta?.total || 0
      } Group${groupsMeta?.total === 1 ? '' : 's'}`}</Text>

      <Container className="employee-group-tab__cards    tax-group__body-content">
        {groups.length < 1 && (
          <TableEmptyState
            text={
              loading ? 'Getting groups...' : 'Your tax groups will appear here'
            }
          />
        )}

        {groups.map((group) => {
          return (
            <div className="group-card" key={group.id}>
              <div className="group-card__header">
                <p>
                  <Link href={`/remittances/nigeria/taxes/groups/${group.id}`}>
                    <a>{group.name}</a>
                  </Link>
                </p>

                <button>
                  <KebabMenu
                    icon={GroupCardMoreIcon}
                    items={menuItems(group)}
                  />
                </button>
              </div>

              <div className="group-card__date">
                <span className="group-card__date__title">Date Created</span>
                <DateTimeChip date={group.createdAt} />
              </div>

              <div className="group-card__footer">
                <span className="group-card__common-salary">
                  <span className="group-card__common-salary__title">
                    Tax Type
                  </span>

                  <span className="group-card__common-salary__amount">
                    {group.meta?.type ? group.meta.type : '——'}
                  </span>
                </span>
                <Avatar.Group
                  maxCount={4}
                  maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                >
                  {group.employees?.map((groupEmployee) => {
                    const employee = groupEmployee?.employee as Employee;

                    return (
                      <Tooltip
                        title={`${employee?.firstname} ${employee?.lastname}`}
                        placement="top"
                        key={employee?.id}
                      >
                        <Avatar
                          style={{
                            backgroundColor: ['#87d068', '#f56a00', '#1890ff'][
                              Math.floor(Math.random() * 3)
                            ],
                          }}
                        >
                          {employee?.firstname.charAt(0)}
                        </Avatar>
                      </Tooltip>
                    );
                  })}
                </Avatar.Group>
              </div>
            </div>
          );
        })}
        <div className="employee-group-tab__cards__pagination">
          <Pagination refresh={setGroupParams} meta={groupsMeta} />
        </div>
      </Container>
    </Container>
  );
};
