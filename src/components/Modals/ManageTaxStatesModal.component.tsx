import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { InputV2 } from '../Input/Input.component';
import { SelectInput } from '../Input/seletct-input';
import { Button } from '../Button/Button.component';
import * as yup from 'yup';
import { useFormik, FormikHelpers } from 'formik';
import { IF } from '../Misc/if.component';
import { useEffect, useState } from 'react';
import { useAppSelector } from 'src/redux/hooks';

const taxStateValidationSchema = yup.object({
  taxId: yup.string().required('Tax ID is required'),
  stateId: yup.string().required('State is required'),
});

const useTasStateModal = (payload: ManageTaxStatesModalProps) => {
  const modal = useModal();
  const administrator = useAppSelector((state) => state.administrator);
  const [taxStates, setTaxStates] = useState<Record<string, string>[]>(
    payload.taxStates ?? [],
  );
  const initialValues = {
    taxId: '',
    stateId: '',
  };

  useEffect(() => {
    setTaxStates(
      (administrator?.company?.statutoryDeductions?.tax?.taxStates as Record<
        string,
        string
      >[]) ?? [],
    );
  }, [administrator]);

  const onSubmit = (
    values: typeof initialValues,
    helpers: FormikHelpers<typeof initialValues>,
  ) => {
    setTaxStates([
      ...taxStates,
      {
        ...values,
        state: payload.states.find((s) => s.id === values.stateId)?.name ?? '',
      },
    ]);
    helpers.resetForm();
  };

  const formik = useFormik({
    initialValues,
    validationSchema: taxStateValidationSchema,
    onSubmit,
  });

  const handleSubmit = () => {
    const t = [...taxStates];
    if (formik.isValid && formik.dirty) {
      t.push({
        ...formik.values,
        state:
          payload.states.find((s) => s.id === formik.values.stateId)?.name ??
          '',
      });
    }

    setTaxStates(t);
    formik.resetForm();

    modal.resolve(t);

    setTimeout(modal.hide, 20);
    setTimeout(modal.remove, 21);
  };

  const handleEdit = (index: number) => () => {
    formik.setValues(taxStates[index] as typeof initialValues);
  };

  const handleRemove = (index: number) => () => {
    setTaxStates(taxStates.filter((_, i) => i !== index));
  };

  return { formik, taxStates, handleSubmit, handleEdit, handleRemove };
};

type ManageTaxStatesModalProps = {
  taxStates: Record<string, string>[];
  states: Record<string, string>[];
};
export const ManageTaxStatesModal = NiceModal.create(
  (props: ManageTaxStatesModalProps) => {
    const {
      formik,
      taxStates,
      handleSubmit,
      handleEdit,
      handleRemove,
    } = useTasStateModal(props);

    return (
      <ModalLayout title="Manage Tax States">
        {() => {
          return (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              <IF condition={taxStates?.length > 0}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '0.5rem',
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        State
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '0.5rem',
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        Tax ID
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '0.5rem',
                          borderBottom: '1px solid #e5e7eb',
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxStates.map((taxState, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            padding: '0.5rem',
                            borderBottom: '1px solid #e5e7eb',
                          }}
                        >
                          {taxState.state}
                        </td>
                        <td
                          style={{
                            padding: '0.5rem',
                            borderBottom: '1px solid #e5e7eb',
                          }}
                        >
                          {taxState.taxId}
                        </td>
                        <td
                          style={{
                            padding: '0.5rem',
                            borderBottom: '1px solid #e5e7eb',
                          }}
                        >
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              style={{ color: '#1d4ed8' }}
                              onClick={handleEdit(index)}
                            >
                              Edit
                            </button>
                            <button
                              style={{ color: '#dc2626' }}
                              onClick={handleRemove(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </IF>

              <form
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2rem',
                }}
                onSubmit={formik.handleSubmit}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    flexDirection: 'column',
                  }}
                >
                  <InputV2
                    label="Tax ID"
                    name="taxId"
                    placeholder="Enter Tax ID"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.taxId}
                    error={formik.touched.taxId && formik.errors.taxId}
                  />

                  <SelectInput
                    label="State"
                    name="stateId"
                    placeholder="Select State"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.stateId}
                    error={formik.touched.stateId && formik.errors.stateId}
                    options={props.states}
                    displayValue="name"
                    actualValue="id"
                    showSearch="Search State"
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Button
                    type="button"
                    primary
                    style={{ width: '100%' }}
                    onClick={handleSubmit}
                  >
                    Save Changes
                  </Button>

                  <Button
                    style={{
                      width: '100%',
                      border: '1px solid #1d4ed8',
                      color: '#1d4ed8',
                    }}
                    type="submit"
                    disabled={!formik.isValid || !formik.dirty}
                  >
                    Add Tax State
                  </Button>
                </div>
              </form>
            </div>
          );
        }}
      </ModalLayout>
    );
  },
);
