import { Radio } from 'antd';
import { Formik } from 'formik';
import { RemittanceTabProps } from './types';
import { useRemittanceTabContext } from './organization-hooks';
import { InputV2 } from '../Input/Input.component';
import { Button } from '../Button/Button.component';

export const NhfTab = (props: RemittanceTabProps) => {
  const { initialValues, handleSubmit } = useRemittanceTabContext(props, 'nhf');

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(_props) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
          } = _props;

          return (
            <form
              className="info__remittance__form"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="info__remittance__form__cont">
                <div className="info__remittance__form__checkbox-cont">
                  <p className="info__remittance__form__hero-text">Status</p>
                  <Radio.Group
                    name="status"
                    value={values.status}
                    onChange={handleChange}
                  >
                    <div className="info__remittance__form__checkbox">
                      <Radio value="Remit">Remit</Radio>
                      <Radio value="Enabled">Enabled</Radio>
                      <Radio value="Disabled">Disabled</Radio>
                    </div>
                  </Radio.Group>
                </div>

                <div className="info__remittance__input-cont">
                  <div>
                    <InputV2
                      label="NHF ID"
                      name="nhfId"
                      placeholder="Enter NHF ID"
                      error={touched.nhfId && errors.nhfId}
                      value={values.nhfId}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="info__remittance__form__action">
                {props.organizationDetails.canEdit && (
                  <Button
                    showSpinner={isSubmitting}
                    disabled={isSubmitting}
                    primary
                    className="info__remittance__form__save-btn"
                    type="submit"
                  >
                    Save Changes
                  </Button>
                )}

                <div></div>

                <Button
                  element="a"
                  href="/organisations/remittance-employees?tab=nhf"
                  className="info__remittance__form__view-btn"
                >
                  View Employees
                </Button>
              </div>
            </form>
          );
        }}
      </Formik>
    </>
  );
};
