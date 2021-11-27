import type { NextPage } from 'next';
import { useCallback, useState, useEffect } from 'react';
import { Table, TR} from './Table.component';
import { toast } from 'react-toastify';
import { PaginationMeta } from 'src/api/types';

const orgnames = [
  { name: 'Esther Howard' },
  { name: 'Brooklyn Simmons' },
  { name: 'Darrell Steward' },
  { name: 'Bessie Cooper' },
  { name: 'Darlene Robertson' },
];

const admins = [
  { role: 'Admin' },
  { role: 'Super Admin' },
  { role: 'Customer Service' },
  { role: 'Super' },
];
const emps = new Array(200).fill(null).map(() => {
  const orgname = orgnames[Math.floor(orgnames.length * Math.random())];
  const admin = admins[Math.floor(admins.length * Math.random())]

  return {
    id: String(Math.random() * 1000000),
    name: `${orgname.name}`,
    activity: 'Logged In',
    role: `${admin.role}`,
    status: 'Successful',
    date: new Date().toISOString(),
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

 export const AuditTable: NextPage = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [employees, setEmployees] = useState<typeof emps>([]);
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
    (page = 1, perPage = 7, search = '') => {
      const res = getEmployees(page, perPage, search);
      setEmployees(res.data);
      setPaginationMeta(res.meta);
    },
    [setEmployees],
  );

  useEffect(() => {
    refreshEmployees();
  }, [refreshEmployees]);

  return (
    <>
          <div className="audittrail">
            <Table
              headerRow={[
                'Name',
                'Activity',
                'Role',
                'Status',
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
              title={'120 Logs'}
              onFilterClick={() =>
                toast.success('closest thing to a filter modal')
              }
            >
              {() => {
                return (
                  <tbody>
                    {employees.map((employee) => {
                      return (
                        <TR
                          key={employee.id}
                          //   checked={selected.includes(employee.id)}
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
                            <span className="audittrail__emp-img">
                              {/* <Image src={credpal} /> */}
                            </span>
                            {employee.name}
                          </td>
                          <td>{employee.activity}</td>
                          <td>{employee.role}</td>
                          <td>
                            <span>
                              <SuccessSvg />
                            </span>
                            {employee.status}
                          </td>
                          <td>{employee.date}</td>
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


const SuccessSvg = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="6" fill="#EAFBF1" />
    <circle cx="6" cy="6" r="3" fill="#27BE63" />
  </svg>
);
