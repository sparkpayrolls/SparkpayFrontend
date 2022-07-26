import { Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Permission, Role } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { CreateRoleValidation } from 'src/helpers/validation';
import { Button } from '../Button/Button.component';
import { InputV2 } from '../Input/Input.component';
import { TableLayout } from '../Table/table-layout.component';
import { TableV2 } from '../Table/Table.component';
import { Text } from '../Typography/Text';

type ICreateRoleForm = {
  // eslint-disable-next-line no-unused-vars
  onDone?(role: Role): any;
  id?: string;
  initialValues?: {
    name: string;
    permissions: string[];
  };
};

export const CreateRoleForm = (props: ICreateRoleForm) => {
  const { onDone, id, initialValues } = props;
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  const getPermissions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await $api.role.getPermissions({ all: true });
      setPermissions(data);
    } catch (error) {
      //...
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPermissions();
  }, [getPermissions]);

  const uniquePermissions = permissions.reduce((acc, cur) => {
    const index = acc.findIndex((a) => a.group === cur.group);
    if (index !== -1) {
      if (cur.level === 'read') {
        acc[index].r = cur.id;
      } else {
        acc[index].w = cur.id;
      }
    } else {
      acc.push({ group: cur.group, r: cur.id, w: cur.id });
    }
    return acc;
  }, [] as { group: string; r: string; w: string }[]);

  return (
    <Formik
      initialValues={initialValues || { name: '', permissions: [] }}
      onSubmit={async (values, helpers) => {
        try {
          helpers.setSubmitting(true);
          let role: Role;
          if (!id) {
            role = await $api.role.createRole(values);
            toast.success('Role created successfully');
          } else {
            role = await $api.role.updateRole(id, values);
            toast.success('Role updated successfully');
          }
          if (onDone) {
            onDone(role);
          }
        } catch (error) {
          const httpError = error as HttpError;
          if (httpError.status === 422) {
            helpers.setErrors(httpError.errors);
            return;
          }
          if (![401, 403].includes(httpError.status)) {
            toast.error(httpError.message);
          }
        } finally {
          helpers.setSubmitting(false);
        }
      }}
      validationSchema={CreateRoleValidation}
    >
      {(props) => {
        const {
          handleSubmit,
          values,
          setValues,
          handleChange,
          touched,
          errors,
          isSubmitting,
        } = props;

        return (
          <form onSubmit={handleSubmit} className="create-role-form">
            <InputV2
              label="Name"
              placeholder="Name"
              value={values.name}
              name="name"
              onChange={handleChange}
              error={touched.name && errors.name}
            />

            <div className="create-role-form__permissions">
              <p>Permissions</p>
              <TableLayout>
                <TableV2 loading={loading}>
                  <thead>
                    <tr>
                      <th></th>
                      <th>View</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uniquePermissions.map((permission) => {
                      return (
                        <tr key={permission.group}>
                          <td>{permission.group}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={
                                values.permissions.includes(permission.w) ||
                                values.permissions.includes(permission.r)
                              }
                              disabled={values.permissions.includes(
                                permission.w,
                              )}
                              onChange={() => {
                                if (
                                  !values.permissions.includes(permission.r)
                                ) {
                                  setValues({
                                    ...values,
                                    permissions: [
                                      ...values.permissions,
                                      permission.r,
                                    ],
                                  });
                                } else {
                                  setValues({
                                    ...values,
                                    permissions: values.permissions.filter(
                                      (p) => p !== permission.r,
                                    ),
                                  });
                                }
                              }}
                            />
                          </td>
                          <td>
                            <input
                              type="checkbox"
                              checked={values.permissions.includes(
                                permission.w,
                              )}
                              onChange={() => {
                                if (
                                  !values.permissions.includes(permission.w)
                                ) {
                                  setValues({
                                    ...values,
                                    permissions: [
                                      ...values.permissions,
                                      permission.w,
                                    ],
                                  });
                                } else {
                                  setValues({
                                    ...values,
                                    permissions: values.permissions.filter(
                                      (p) => p !== permission.w,
                                    ),
                                  });
                                }
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </TableV2>
              </TableLayout>
              <Text className="input-v2--error__error text__text-sm text__danger">
                {(touched.permissions &&
                  (Array.isArray(errors.permissions)
                    ? errors.permissions.join(',')
                    : errors.permissions)) ||
                  ''}
              </Text>
            </div>

            <Button
              disabled={isSubmitting || Util.deepEquals(values, initialValues)}
              showSpinner={isSubmitting}
              type="submit"
              label="Save Role"
              primary
            />
          </form>
        );
      }}
    </Formik>
  );
};
