import { Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Role, User } from 'src/api/types';
import { CreateAdministratorValidation } from 'src/helpers/validation';
import { useAppSelector } from 'src/redux/hooks';
import { Button } from '../Button/Button.component';
import { Select } from '../Input/select.component';
import { UserAutoComplete } from '../Input/user-autocomplete.component';

type ICreateAdministratorForm = {
  onDone?(): any;
  id?: string;
  initialValues?: {
    role: string;
    user: string;
    email: string;
    name: string;
  };
};

export const CreateAdministratorForm = (props: ICreateAdministratorForm) => {
  const { onDone, initialValues, id } = props;
  const administrator = useAppSelector((state) => state.administrator);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);

  const getRoles = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await $api.role.getCompanyRoles({ all: true });
      setRoles(data);
    } catch (error) {
      //...
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getRoles();
  }, [getRoles, administrator]);

  return (
    <Formik
      initialValues={
        initialValues || {
          role: '',
          user: '',
          email: '',
          name: '',
        }
      }
      onSubmit={async (values, helpers) => {
        try {
          helpers.setSubmitting(true);
          if (!values.user) {
            //@ts-ignore
            delete values.user;
          }
          if (!id) {
            await $api.admin.inviteAdministrator(values);
            toast.success('Administrator invited successfully');
          } else {
            await $api.admin.updateAdministrator(id, { role: values.role });
            toast.success('Administrator updated successfully');
          }
          if (onDone) {
            onDone();
          }
        } catch (error) {
          const err = error as HttpError;
          if (err.status === 422) {
            helpers.setErrors(err.errors);
            return;
          }

          toast.error(err.message);
        } finally {
          helpers.setSubmitting(false);
        }
      }}
      validationSchema={CreateAdministratorValidation}
    >
      {(props) => {
        const {
          handleSubmit,
          isSubmitting,
          values,
          setValues,
          errors,
          touched,
        } = props;

        return (
          <form onSubmit={handleSubmit} className="create-administrator-form">
            <UserAutoComplete
              label="Full Name"
              placeholder="Full Name"
              value={values.name}
              onChange={(value) => {
                setValues({ ...values, name: value });
              }}
              onSelect={(user: User) => {
                setValues({
                  ...values,
                  user: user.id,
                  email: user.email,
                  name: `${user.firstname} ${user.lastname}`,
                });
              }}
              error={(touched.name && errors.name) || ''}
              disabled={!!id}
            />

            <UserAutoComplete
              label="Email"
              placeholder="Email"
              value={values.email}
              onChange={(value) => {
                setValues({ ...values, email: value });
              }}
              onSelect={(user: User) => {
                setValues({
                  ...values,
                  user: user.id,
                  email: user.email,
                  name: `${user.firstname} ${user.lastname}`,
                });
              }}
              error={(touched.email && errors.email) || ''}
              disabled={!!id}
            />

            <Select
              label="Role"
              placeholder="Select Role"
              options={roles.map((role) => ({
                value: role.id,
                label: role.name,
              }))}
              loading={loading}
              value={values.role}
              onChange={(value) => {
                setValues({ ...values, role: value });
              }}
              error={(touched.role && errors.role) || ''}
            />

            <Button
              disabled={isSubmitting || values.role === initialValues?.role}
              showSpinner={isSubmitting}
              type="submit"
              label={!id ? 'Invite Administrator' : 'Save Administrator'}
              primary
            />
          </form>
        );
      }}
    </Formik>
  );
};
