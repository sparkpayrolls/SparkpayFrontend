import NiceModal from '@ebay/nice-modal-react';
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
import { CreateRoleModal } from '../Modals/CreateRoleModal.component';
import { PlusSvg } from '../svg';

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

/**
 * Sits under the field so the way forward is visible without opening the
 * dropdown. The dropdown carries its own create action for the case where
 * roles exist but none of them fit.
 */
const NoRolesHint = (props: { onCreate(): void }) => (
  <div className="create-administrator-form__no-roles">
    <span className="create-administrator-form__no-roles-text">
      No roles yet.
    </span>
    <button
      type="button"
      className="create-administrator-form__no-roles-link"
      onClick={props.onCreate}
    >
      Create a role
    </button>
  </div>
);

export const CreateAdministratorForm = (props: ICreateAdministratorForm) => {
  const { onDone, initialValues, id } = props;
  const administrator = useAppSelector((state) => state.administrator);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  // controlled so the create-role click can close it; the dropdown outranks
  // the drawers (antd: 1050 vs 1000) and would otherwise float over the
  // create-role modal
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

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

  const hasNoRoles = !loading && !roles.length;

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

        const createRole = async () => {
          setRoleDropdownOpen(false);

          const role = (await NiceModal.show(CreateRoleModal)) as Role;

          await getRoles();
          setValues({ ...values, role: role.id });
        };

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

            <div className="create-administrator-form__role-field">
              <Select
                label="Role"
                placeholder="Select Role"
                loading={loading}
                // an empty string reads as a selected value and hides the
                // placeholder
                value={values.role || undefined}
                open={roleDropdownOpen}
                onDropdownVisibleChange={setRoleDropdownOpen}
                onChange={(value) => {
                  setValues({ ...values, role: value });
                }}
                error={(!hasNoRoles && touched.role && errors.role) || ''}
                // the selector shows the plain name, the dropdown the fuller
                // option below
                optionLabelProp="label"
                dropdownClassName="role-dropdown"
                notFoundContent={
                  <p className="role-dropdown__empty">
                    {loading ? 'Loading roles…' : 'No roles yet'}
                  </p>
                }
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <button
                      type="button"
                      className="role-dropdown__create"
                      // keep the select from stealing the click and closing
                      // the dropdown before it lands
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={createRole}
                    >
                      <PlusSvg />
                      Create a role
                    </button>
                  </>
                )}
              >
                {roles.map((role) => (
                  <Select.Option
                    key={role.id}
                    value={role.id}
                    label={role.name}
                  >
                    <span className="role-dropdown__name">{role.name}</span>
                    {role.description && (
                      <span className="role-dropdown__description">
                        {role.description}
                      </span>
                    )}
                  </Select.Option>
                ))}
              </Select>

              {hasNoRoles && <NoRolesHint onCreate={createRole} />}
            </div>

            <Button
              disabled={
                isSubmitting || hasNoRoles || values.role === initialValues?.role
              }
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
