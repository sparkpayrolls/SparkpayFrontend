import { useRouter } from 'next/router';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Employee, PaginationMeta } from 'src/api/types';
import { Util } from '../util';
import { useSelectItems } from './use-select-items.hook';

export const useGroupEmployeesPageContext = () => {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    page: 1,
    pageCount: 1,
    pagingCounter: 1,
    perPage: 10,
    previousPage: null,
  });
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    search: '',
  });
  const [loading, setLoading] = useState(false);
  const {
    allChecked,
    selected,
    selectAll,
    clearSelection,
    getCheckClickHandler,
    handleCheckAllClick,
    handleSelectAllClick,
  } = useSelectItems(employees.map((employee) => employee.id));

  const groupId = router.query.id as string;

  const getEmployees = useCallback(() => {
    setLoading(true);
    return $api.group
      .getEmployeesNotInGroup(groupId, params)
      .then(({ data, meta = {} }) => {
        setEmployees(data);
        setPaginationMeta((p) => ({ ...p, ...meta }));
      })
      .catch((error) => {
        Util.onNonAuthError(error, (error) => {
          toast.error(`error fetching employees - ${error.message}`);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [groupId, params]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  const addEmployees = (id: string[]) => {
    return () => {
      if (!id.length) {
        return;
      }
      const employee = id.length > 1 ? 'employees' : 'employee';
      setLoading(true);
      $api.employee
        .addEmployeesToGroup(groupId, id, selectAll)
        .then(() => {
          return getEmployees();
        })
        .then(() => {
          toast.success(`${employee} added to group successfully`);
          clearSelection();
        })
        .catch((error) => {
          Util.onNonAuthError(error, (error) => {
            toast.error(`error adding ${employee} ${error.message}`);
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };
  };

  const updateParams = (obj: Record<string, unknown>) => {
    setParams({ ...params, ...obj });
  };

  return {
    paginationMeta,
    groupId,
    allChecked,
    params,
    selected,
    selectAll,
    employees,
    loading,
    handleCheckAllClick,
    handleSelectAllClick,
    addEmployees,
    clearSelection,
    updateParams,
    getCheckClickHandler,
  };
};
