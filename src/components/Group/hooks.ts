import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { EmployeeGroup, PaginationMeta } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { IGroupEmployees } from './group-employees.component';

export const useGroupEmployeeContext = (props: IGroupEmployees) => {
  const { groupId } = props;
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
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
    search: '',
    page: 1,
    limit: 10,
  });
  const [employees, setEmployees] = useState<EmployeeGroup[]>([]);

  const getGroupEmployees = useCallback(() => {
    setLoading(true);
    $api.group
      .getGroupEmployees(groupId as string, params)
      .then(({ data, meta = {} }) => {
        setEmployees(data);
        setPaginationMeta((p) => ({ ...p, ...meta }));
      })
      .catch((error) => {
        Util.onNonAuthError(error, (error) => {
          toast.error(`error loading employees - ${error.message}`);
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [groupId, params]);

  useEffect(() => {
    getGroupEmployees();
  }, [getGroupEmployees]);

  const allChecked = !!employees.length && selected.length >= employees.length;

  const getCheckClickHandler = (id: string) => {
    return () => {
      if (selected.includes(id)) {
        setSelectAll(false);
        setSelected(selected.filter((s) => s !== id));
      } else {
        setSelected([...selected, id]);
      }
    };
  };
  const clearSelection = () => {
    setSelectAll(false);
    setSelected([]);
  };
  const handleCheckAllClick = () => {
    if (selected.length > 0 || selectAll) {
      clearSelection();
    } else {
      setSelected(employees.map((employee) => employee.id));
    }
  };
  const handleSelectAllClick = () => {
    setSelectAll(true);
  };
  const updateParams = (obj: Record<string, unknown>) => {
    setParams({ ...params, ...obj });
  };
  const removeEmployees = (id: string[]) => {
    return () => {
      if (!id.length) {
        return;
      }
      const employee = id.length > 1 ? 'employees' : 'employee';
      setLoading(true);
      $api.employee
        .removeEmployeesFromGroup(groupId as string, id, selectAll)
        .then(() => {
          return getGroupEmployees();
        })
        .then(() => {
          toast.success(`${employee} removed from group successfully`);
          clearSelection();
        })
        .catch((error) => {
          Util.onNonAuthError(error, (error) => {
            toast.error(`error removing ${employee} ${error.message}`);
          });
        })
        .finally(() => {
          setLoading(false);
        });
    };
  };

  return {
    selected,
    allChecked,
    handleCheckAllClick,
    paginationMeta,
    handleSelectAllClick,
    clearSelection,
    employees,
    selectAll,
    getCheckClickHandler,
    loading,
    setParams,
    updateParams,
    params,
    removeEmployees,
  };
};
