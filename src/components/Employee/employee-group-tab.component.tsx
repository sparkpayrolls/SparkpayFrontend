import Link from 'next/link';
import { GroupCardMoreIcon } from '../svg';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { StatusChip } from '../StatusChip/status-chip.component';
import { SearchForm } from '../Form/search.form';
import { Pagination } from '../Pagination/pagination.component';

export const EmployeeGroup = () => {
  return (
    <div className="employee-group-tab">
      <div className="employee-group-tab__header">
        <p>300 Group(s)</p>

        <div>
          <SearchForm placeholder="Search by group name" />
        </div>
      </div>

      <div className="employee-group-tab__cards">
        <div className="group-card">
          <div className="group-card__header">
            <p>
              <Link href="/employees/group-details">
                <a>Group Name Here</a>
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
            <DateTimeChip />
          </div>

          <div className="group-card__footer">
            <StatusChip status="active" />

            <span className="group-card__common-salary">
              <span className="group-card__common-salary__title">
                Common Salary
              </span>

              <span className="group-card__common-salary__amount">
                ₦ 200,000
              </span>
            </span>
          </div>
        </div>

        <div className="employee-group-tab__cards__pagination">
          <Pagination />
        </div>
      </div>
    </div>
  );
};
