import classNames from 'classnames';
import { Formik } from 'formik';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { Permission, Role } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { CreateRoleValidation } from 'src/helpers/validation';
import { Button } from '../Button/Button.component';
import { InputV2, TextArea } from '../Input/Input.component';
import { Text } from '../Typography/Text';

type ICreateRoleForm = {
  // eslint-disable-next-line no-unused-vars
  onDone?(role: Role): any;
  id?: string;
  initialValues?: {
    name: string;
    permissions: string[];
    description?: string;
  };
};

type AccessLevel = 'none' | 'read' | 'write';

type PermissionRow = {
  group: string;
  label: string;
  description: string;
  read?: string;
  write?: string;
};

/**
 * The api exposes permission groups as raw enum names (`AuditTrail`), which
 * are not copy. This also fixes the order they are listed in — most reached
 * for first — rather than leaving it to insertion order in the database.
 */
const GROUP_COPY: Record<string, { label: string; description: string }> = {
  Overview: {
    label: 'Overview',
    description: 'Dashboard summaries and company stats',
  },
  Employee: {
    label: 'Employees',
    description: 'Employee records, salaries and onboarding',
  },
  Payroll: {
    label: 'Payroll',
    description: 'Creating, reviewing and running payroll',
  },
  Transaction: {
    label: 'Transactions',
    description: 'Wallet funding, transfers and payment history',
  },
  Remittance: {
    label: 'Remittances',
    description: 'PAYE, pension and other statutory remittances',
  },
  Company: {
    label: 'Company',
    description: 'Company profile, settings and salary structure',
  },
  Administrator: {
    label: 'Administrators',
    description: 'Inviting administrators and managing roles',
  },
  AuditTrail: {
    label: 'Audit Trail',
    description: 'Log of every action taken on the account',
  },
};

const GROUP_ORDER = Object.keys(GROUP_COPY);

/**
 * `write` already grants `read` in the api's permission guard, so access is a
 * ladder rather than two independent toggles.
 */
const ACCESS_LEVELS: { value: AccessLevel; label: string }[] = [
  { value: 'none', label: 'No access' },
  { value: 'read', label: 'View' },
  { value: 'write', label: 'Manage' },
];

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

  const rows = useMemo<PermissionRow[]>(() => {
    const groups: string[] = [];
    permissions.forEach(({ group }) => {
      if (!groups.includes(group as string)) {
        groups.push(group as string);
      }
    });

    return groups
      .map((group) => ({
        group,
        label: GROUP_COPY[group]?.label || group,
        description: GROUP_COPY[group]?.description || '',
        read: permissions.find((p) => p.group === group && p.level === 'read')
          ?.id,
        write: permissions.find((p) => p.group === group && p.level === 'write')
          ?.id,
      }))
      .sort((a, b) => {
        // groups the api adds later, that have no copy yet, sort to the end
        const order = (group: string) => {
          const index = GROUP_ORDER.indexOf(group);
          return index === -1 ? GROUP_ORDER.length : index;
        };

        return order(a.group) - order(b.group);
      });
  }, [permissions]);

  const formInitialValues = {
    name: initialValues?.name ?? '',
    description: initialValues?.description ?? '',
    permissions: initialValues?.permissions ?? [],
  };

  return (
    <Formik
      initialValues={formInitialValues}
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

        const levelOf = (row: PermissionRow): AccessLevel => {
          if (row.write && values.permissions.includes(row.write)) {
            return 'write';
          }
          if (row.read && values.permissions.includes(row.read)) {
            return 'read';
          }

          return 'none';
        };

        const setLevel = (row: PermissionRow, level: AccessLevel) => {
          const rest = values.permissions.filter(
            (permission) => permission !== row.read && permission !== row.write,
          );

          if (level === 'read' && row.read) {
            rest.push(row.read);
          }
          if (level === 'write' && row.write) {
            rest.push(row.write);
          }

          setValues({ ...values, permissions: rest });
        };

        const grantedCount = rows.filter(
          (row) => levelOf(row) !== 'none',
        ).length;

        const permissionsError =
          (touched.permissions &&
            (Array.isArray(errors.permissions)
              ? errors.permissions.join(', ')
              : errors.permissions)) ||
          '';

        return (
          <form onSubmit={handleSubmit} className="create-role-form">
            <InputV2
              label="Name"
              placeholder="e.g. Payroll Manager"
              value={values.name}
              name="name"
              onChange={handleChange}
              error={touched.name && errors.name}
            />

            <TextArea
              label="Description"
              labelFor="role-description"
              id="role-description"
              name="description"
              rows={3}
              placeholder="e.g. Can run payroll and manage employees, but cannot invite administrators."
              value={values.description}
              onChange={handleChange}
              error={touched.description && errors.description}
              helper="Shown to administrators when they pick a role."
            />

            <fieldset className="create-role-form__permissions">
              <legend className="create-role-form__permissions-title">
                Access
              </legend>

              <div className="create-role-form__permissions-meta">
                <p className="create-role-form__permissions-help">
                  Manage includes everything in View.
                </p>
                <span className="create-role-form__permissions-count">
                  {grantedCount} of {rows.length} areas
                </span>
              </div>

              {loading && !rows.length ? (
                <p className="create-role-form__permissions-loading">
                  Loading access areas…
                </p>
              ) : (
                <ul className="permission-list">
                  {rows.map((row) => {
                    const current = levelOf(row);

                    return (
                      <li className="permission-list__row" key={row.group}>
                        <div className="permission-list__text">
                          <p className="permission-list__label">{row.label}</p>
                          {row.description && (
                            <p className="permission-list__description">
                              {row.description}
                            </p>
                          )}
                        </div>

                        <div
                          className="permission-list__levels"
                          role="radiogroup"
                          aria-label={`${row.label} access`}
                        >
                          {ACCESS_LEVELS.map((level) => {
                            const unavailable =
                              (level.value === 'read' && !row.read) ||
                              (level.value === 'write' && !row.write);

                            return (
                              <label
                                key={level.value}
                                className={classNames(
                                  'permission-list__level',
                                  {
                                    'permission-list__level--active':
                                      current === level.value,
                                    'permission-list__level--disabled':
                                      unavailable,
                                  },
                                )}
                              >
                                <input
                                  type="radio"
                                  name={`access-${row.group}`}
                                  value={level.value}
                                  checked={current === level.value}
                                  disabled={unavailable}
                                  onChange={() => setLevel(row, level.value)}
                                />
                                {level.label}
                              </label>
                            );
                          })}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}

              {!!permissionsError && (
                <Text className="input-v2--error__error text__text-sm text__danger">
                  {permissionsError}
                </Text>
              )}
            </fieldset>

            <Button
              disabled={
                isSubmitting || Util.deepEquals(values, formInitialValues)
              }
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
