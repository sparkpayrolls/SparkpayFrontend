import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { FormikHelpers, useFormik } from 'formik';
import debounce from 'lodash.debounce';
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Administrator, PaginationMeta, Role, User } from 'src/api/types';
import { CreatePayrollApproverValidation } from 'src/helpers/validation';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { commitAministrator } from 'src/redux/slices/administrator/administrator.slice';
import { confirmation } from '../Modals/ConfirmationModal.component';
import { CreatePayrollApproverModal } from '../Modals/CreatePayrollApproverModal.component';

type IuseCreateApproverForm = {
  initialValues?: Pick<Administrator, 'payrollApproverIndex' | 'id'>;
};
export const useCreateApproverForm = (payload: IuseCreateApproverForm) => {
  const dispatch = useAppDispatch();
  const administrator = useAppSelector((state) => state.administrator);
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const initialValues = payload.initialValues || {
    id: '',
    payrollApproverIndex: '',
  };
  const modal = useModal();
  const onSubmit = (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>,
  ) => {
    $api.admin
      .updateAdministrator(values.id, {
        payrollApproverIndex: values.payrollApproverIndex as number,
      })
      .then(() => {
        modal.resolve();
        setTimeout(modal.hide, 10);
        toast.success('Approver update successfull');
        dispatch(commitAministrator(administrator));
      })
      .catch((error) => {
        const err = error as HttpError;
        if (err.status === 422) {
          helpers.setErrors(err.errors);
          return;
        }

        toast.error(err.message);
      })
      .finally(() => helpers.setSubmitting(false));
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema: CreatePayrollApproverValidation,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchAdministrators = useCallback(
    debounce((search: string) => {
      $api.admin.getAdministrators({ search, limit: 4 }).then(({ data }) => {
        setAdministrators(data);
      });
    }, 300),
    [],
  );

  const getDisplayValue = (admin: Record<string, unknown>) => {
    return `${(admin.user as User).firstname} ${(admin.user as User).lastname}`;
  };

  return {
    ...formik,
    administrators,
    searchAdministrators,
    buttonText: !payload.initialValues?.id ? 'Add Approver' : 'Save Approver',
    getDisplayValue,
  };
};

export const useApprovers = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [params, setParams] = useState({} as Record<string, any>);
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(false);

  const getAdministrators = useCallback(async () => {
    try {
      setLoading(true);
      const { data, meta } = await $api.admin.getAdministrators({
        ...params,
        payrollApprovers: true,
      });
      setAdministrators(data);
      setMeta(meta);
    } catch (error) {
      const err = error as HttpError;
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const onEditAdministrator = (admin: Administrator) => {
    return () => {
      NiceModal.show(CreatePayrollApproverModal, {
        initialValues: {
          id: admin.id,
          payrollApproverIndex: admin.payrollApproverIndex,
        },
      });
    };
  };

  const onDeleteAdministrator = (id: string) => {
    return async () => {
      const canDelete = await confirmation({
        title: 'Remove Approver',
        text: 'Are you sure you want to remove this approver?',
      });
      if (!canDelete) {
        return;
      }
      try {
        setLoading(true);
        setAdministrators(
          administrators.filter((administrator) => administrator.id !== id),
        );
        await $api.admin.updateAdministrator(id, { payrollApproverIndex: 0 });
        toast.success('Approver removed successfully');
        await getAdministrators();
      } catch (error) {
        const err = error as HttpError;
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
  };

  useEffect(() => {
    getAdministrators();
  }, [getAdministrators, administrator]);

  const handleSearch = (search: string) => setParams({ ...params, search });
  const getAdminDetails = (admin: Administrator) => {
    const user = admin.user as User;
    const role = admin.role as Role;
    return {
      name: `${user.firstname} ${user.lastname}${
        administrator?.id === admin.id ? ' (You)' : ''
      }`,
      avatar: user.avatar,
      initial: user.firstname.slice(0, 1),
      email: user.email,
      role: admin.isRoot ? 'Owner' : role?.name,
      createdAt: admin.createdAt,
      payrollApproverIndex: admin.payrollApproverIndex,
      options: [
        {
          value: 'Edit',
          action: onEditAdministrator(admin),
        },
        {
          value: 'Delete',
          action: onDeleteAdministrator(admin.id),
        },
      ],
    };
  };

  return {
    meta,
    title: `${meta?.total || 0} Approver${meta?.total === 1 ? '' : 's'}`,
    loading,
    administrators: administrators.sort(
      (a, b) => (a.payrollApproverIndex ?? 0) - (b.payrollApproverIndex ?? 0),
    ),
    getAdminDetails,
    handleSearch,
    setParams,
  };
};
