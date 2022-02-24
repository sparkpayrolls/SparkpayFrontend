import Image from 'next/image';
import SearchInput from '../../../public/svgs/search.svg';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';
import { StatusChip } from '../StatusChip/status-chip.component';

const EmployeeGroupCard = ({
  name,
  date,
  datetext,
  salaryamount,
  salarytext,
}: {
  name: string;
  date: string;
  datetext: string;
  salarytext: string;
  salaryamount: string;
}) => {
  return (
    <div className="employee-details__employee-group-cards">
      <div className="employee-details__employee-card-flex">
        <div className="employee-details__employee-card-header">
          <h1>{name}</h1>
          <p className="employee-details__employee-card-datetext">{datetext}</p>
          <p className="employee-details__employee-card-date">{date}</p>
        </div>
        <div>
          <KebabMenu
            items={[
              {
                value: 'view',
              },
              {
                value: 'delete',
              },
            ]}
          />
        </div>
      </div>
      <hr classsName="employee-details__employee-card-hr" />
      <div className="employee-details__employee-card-flex">
        <div>
          <StatusChip status="successful" />
        </div>
        <div>
          <p className="employee-details__employee-salary-text">{salarytext}</p>
          <p className="employee-details__employee-salary-amount">
            {salaryamount}
          </p>
        </div>
      </div>
    </div>
  );
};

export const EmployeeGroup = () => {
  return (
    <div className="employee-group">
      <div className="employee-section__employeeSearch">
        <div className="employee-section__employeeHeader">
          {/* <p>30 Employee(s)</p> */}
          <p>0 Employee(s)</p>
        </div>
        <div className="employee-section__searchInput">
          <div className="employee-section__searchIcon">
            <div>
              <input
                type="text"
                placeholder="Search by name"
                className="employee-section__search"
              />
            </div>
            <div className="employee-section__searchImage">
              <Image src={SearchInput} alt="search-image" />
            </div>
          </div>
        </div>
      </div>

      <section className="employee-details__employee-cards employee-group-details">
        <EmployeeGroupCard
          name="Group Name Here"
          datetext="Date Created"
          date="September 16, 2021 | 12:40 PM "
          salarytext="Common Salary"
          salaryamount="₦ 200,000"
        />
        <EmployeeGroupCard
          name="Group Name Here"
          datetext="Date Created"
          date="September 16, 2021 | 12:40 PM "
          salarytext="Common Salary"
          salaryamount="₦ 200,000"
        />
        <EmployeeGroupCard
          name="Group Name Here"
          datetext="Date Created"
          date="September 16, 2021 | 12:40 PM "
          salarytext="Common Salary"
          salaryamount="₦ 200,000"
        />
      </section>
    </div>
  );
};
