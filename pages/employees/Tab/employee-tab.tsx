import { NextPage } from 'next';
// import Image from 'next/image';
import Head from 'next/head';
// import SearchInput from '../../../public/svgs/search.svg';
// import Filter from '../../../public/svgs/filter.svg';
// import EmployeeInfo from '../../../public/svgs/employeeIcon.svg';
// import Inbox from '../../../public/svgs/employee-inbox.svg';
import { Table, TR } from './table.component';
import { useCallback, useState, useEffect } from 'react';
import { Employee, PaginationMeta } from 'src/api/types';
import { $api } from 'src/api';
import { toast } from 'react-toastify';
// import { toast } from 'react-toastify';

// const EmployeeTab: NextPage = () => {
//   // const notify = () => toast.warning('Wow so easy !', { delay: 1000 });
//   return (
//     <>
//       <Head>
//         <title>Employee Tab</title>
//       </Head>
//       <div className="employee-section">
//         <div className="employee-section__employee-tab">
//           <div className="employee-section__employeeSearch">
//             <div className="employee-section__employeeHeader">
//               {/* <p>30 Employee(s)</p> */}
//               <p>0 Employee(s)</p>
//             </div>
//             <div className="employee-section__searchInput">
//               <div className="employee-section__searchIcon">
//                 <div>
//                   <input
//                     type="text"
//                     placeholder="Search by name"
//                     className="employee-section__search"
//                   />
//                 </div>
//                 <div className="employee-section__searchImage">
//                   <Image src={SearchInput} alt="search-image" />
//                 </div>
//                 <div className="employee-section__searchIcon">
//                   <div>
//                     <input
//                       type="text"
//                       placeholder="Filter"
//                       className="employee-section__filter"
//                     />
//                   </div>
//                   <div className="employee-section__searchImage">
//                     <Image src={Filter} alt="filter-image" />
//                   </div>
//                   <span className="employee-section__employeeInfo">
//                     <Image src={EmployeeInfo} alt="info-image" />
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <table>
//             <tr className="employee-section__employeeTitle">
//               <span>
//                 <input
//                   type="checkbox"
//                   className="employee-section__employee_Input"
//                   value="checkinputOne"
//                 />
//                 <span className="employee-section__employee-name">
//                   {' '}
//                   <th>Name</th>
//                 </span>
//               </span>
//               <th>Email Address</th>
//               <th>Amount (₦) </th>
//               <th>Payout Method</th>
//               <th>Group</th>
//               <th>Date Added</th>
//             </tr>
//           </table>

//           <div className="employee-section__employee-inbox">
//             <Image src={Inbox} alt="inbox icon" />
//             <p>No employee yet</p>
//           </div>

//           <div className="employee-section__nextPages">
//             <p>
//               Showing <span className="employee">Page 1 of 10</span>
//             </p>

//             <div className="employee-section__prev_next_pages">
//               <p>Prev</p>
//               <p>1</p>
//               <p>2</p>
//               <p>Next</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

const names = [
  { firstname: 'Tomike', lastname: 'Peter' },
  { firstname: 'Christianah', lastname: 'Peter' },
  { firstname: 'Opeyemi', lastname: 'Peter' },
  { firstname: 'Emmanuel', lastname: 'Menyaga' },
  { firstname: 'Ojonugwa', lastname: 'Alikali' },
];
const emps = new Array(200).fill(null).map(() => {
  const name = names[Math.floor(names.length * Math.random())];

  return {
    id: String(Math.random() * 1000000),
    name: `${name.firstname} ${name.lastname}`,
    email: `${name.firstname.toLowerCase()}@sparkpayhq.com`,
    amount: Number((Math.random() * 1000000).toFixed(2)).toLocaleString(),
    payoutMethod: 'Bank Transfer',
    date: new Date().toISOString(),
    groups: [{ name: 'Group 1' }, { name: 'Group 2' }],
  };
});
const getEmployees = (page = 1, perPage = 10, search = '') => {
  let empClone = emps;
  if (search) {
    empClone = empClone.filter((emp) => {
      return new RegExp(search, 'gi').test(emp.name);
    });
  }

  const pageCount = Math.ceil((empClone.length || 1) / perPage);
  const hasPrevPage = page > 1 && empClone.length >= 1;
  const hasNextPage = page < pageCount;

  return {
    data: empClone.slice((page - 1) * perPage, perPage * page),
    meta: {
      total: empClone.length,
      perPage,
      pageCount,
      page,
      pagingCounter: 1,
      hasNextPage,
      hasPrevPage,
      previousPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
    },
  };
};

const EmployeeTabMini: NextPage = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    perPage: 10,
    pageCount: 0,
    page: 1,
    pagingCounter: 1,
    hasNextPage: false,
    hasPrevPage: false,
    previousPage: null,
    nextPage: null,
  });

  const refreshEmployees = useCallback(
    // eslint-disable-next-line no-unused-vars
    async (page = 1, perPage = 3, search = '') => {
      // const res = getEmployees(page, perPage, search);
      const res = await $api.employee.getEmployees(page, perPage);
      setEmployees(res.data);
      if (res.meta) {
        setPaginationMeta(res.meta);
      }
    },
    [setEmployees],
  );

  useEffect(() => {
    refreshEmployees();
  }, [refreshEmployees]);

  return (
    <>
      <Head>
        <title>Employee Tab</title>
      </Head>
      <div className="employee-section">
        <Table
          headerRow={[
            'Name',
            'Email Address',
            'Amount (₦)',
            'Payout Method',
            'Group',
            'Date Added',
          ]}
          allChecked={
            !!selected.length &&
            employees.every((employee) => selected.includes(employee.id))
          }
          onCheckAllClick={() => {
            if (selected.length === employees.length) {
              setSelected([]);
              return;
            }
            setSelected(employees.map((employee) => employee.id));
          }}
          paginationMeta={paginationMeta}
          refresh={refreshEmployees}
          title={`(${paginationMeta.total}) Kings and Queens`}
          onFilterClick={() => toast.success('closest thing to a filter modal')}
          isEmpty={!employees.length}
        >
          {() => {
            return (
              <tbody>
                {employees.map((employee) => {
                  return (
                    <TR
                      key={employee.id}
                      checked={selected.includes(employee.id)}
                      onChange={() => {
                        if (selected.includes(employee.id)) {
                          setSelected(
                            selected.filter((sel) => sel !== employee.id),
                          );
                          return;
                        }

                        setSelected([...selected, employee.id]);
                      }}
                    >
                      <td>
                        {employee.firstname} {employee.lastname}
                      </td>
                      <td>{employee.email}</td>
                      <td>{employee.salary}</td>
                      <td>{employee.payoutMethod?.name}</td>
                      <td>Group Names</td>
                      {/* <td>
                        {employee.groups.map((group) => group.name).join(', ')}
                      </td> */}
                      <td>{employee.createdAt}</td>
                    </TR>
                  );
                })}
              </tbody>
            );
          }}
        </Table>
      </div>
    </>
  );
};

export default EmployeeTabMini;
