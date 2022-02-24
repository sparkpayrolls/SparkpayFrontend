import Image from 'next/image';
// import Link from 'next/link';
import SearchInput from '../../../public/svgs/search.svg';
import { KebabMenu } from '../KebabMenu/KebabMenu.component';

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
    <div className="employee-details__employee-cards">
      <div className="employ">
        <h1>{name}</h1>
        <p>{date}</p>
        <p>{datetext}</p>
      </div>
      <div>
        <KebabMenu
          items={[
            {
              value: 'Accept',
            },
            {
              value: 'Reject,',
            },
          ]}
        />
      </div>
      <hr />
      <div>
        <p>{salarytext}</p>
        <p>{salaryamount}</p>
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

      <section className="employee-group__employee-group-cards">
        <EmployeeGroupCard
          name="Group Name Here"
          date="1997"
          datetext="hi"
          salarytext="hrllo"
          salaryamount="hi"
        />
      </section>
    </div>
  );
};
