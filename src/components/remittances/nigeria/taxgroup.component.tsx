import { DateTimeChip } from '@/components/DateTimeChip/date-time-chip';
import { KebabMenu } from '@/components/KebabMenu/KebabMenu.component';
import { TaxGroupModal } from '@/components/Modals/TaxGroupModal.component';
import { Pagination } from '@/components/Pagination/pagination.component';
import { Container } from '@/components/Shared/container.component';
import { GroupCardMoreIcon } from '@/components/svg';
import { Text } from '@/components/Typography/Text';
import NiceModal from '@ebay/nice-modal-react';
import { Avatar, Tooltip } from 'antd';
import Link from 'next/link';

export const TaxGroup = () => {
  const menuItems = (id: string) => [
    { value: 'View', href: `/remittances/nigeria/taxes/groups/${id}` },
    {
      value: 'Edit',
      action() {
        NiceModal.show(TaxGroupModal, {
          id: 'tax-group-id',
          initialValues: {
            name: 'Tax Group',
            description: 'An awesome description about this tax group',
            salaryBreakdown: [
              { name: 'Basic', value: 40 },
              { name: 'Housing', value: 30 },
              { name: 'Transport', value: 30 },
            ],
            customTaxRelief: [{ name: 'Health Insurance', amount: 3000 }],
          },
        });
      },
    },
    {
      value: 'Delete',
      action() {},
    },
  ];

  return (
    <Container className="tax-group" loading showContent>
      <Text className="tax-group__page-title " element="h2" text="3 Group(s)" />

      <Container className="employee-group-tab__cards    tax-group__body-content">
        {/* <TableEmptyState text="Your tax groups will appear here" /> */}

        {Array(10)
          .fill(null)
          .map((_, i) => {
            return (
              <div className="group-card" key={i}>
                <div className="group-card__header">
                  <p>
                    <Link href={`/remittances/nigeria/taxes/groups/${i}`}>
                      <a>Tax Group</a>
                    </Link>
                  </p>

                  <button>
                    <KebabMenu
                      icon={GroupCardMoreIcon}
                      items={menuItems(`${i}`)}
                    />
                  </button>
                </div>

                <div className="group-card__date">
                  <span className="group-card__date__title">Date Created</span>
                  <DateTimeChip />
                </div>

                <div className="group-card__footer">
                  <span className="group-card__common-salary">
                    <span className="group-card__common-salary__title">
                      Common Salary
                    </span>

                    <span className="group-card__common-salary__amount">
                      ₦ 200,000
                    </span>
                  </span>
                  <Avatar.Group
                    maxCount={4}
                    maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                  >
                    <Avatar src="https://joeschmoe.io/api/v1/random" />
                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                    <Tooltip title="Ant User" placement="top">
                      <Avatar style={{ backgroundColor: '#87d068' }}>E</Avatar>
                    </Tooltip>
                    <Avatar style={{ backgroundColor: '#1890ff' }}>O</Avatar>
                  </Avatar.Group>
                </div>
              </div>
            );
          })}
        <div className="employee-group-tab__cards__pagination">
          <Pagination refresh={() => {}} meta={{ total: 1000 }} />
        </div>
      </Container>
    </Container>
  );
};
