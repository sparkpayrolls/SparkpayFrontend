import { Radio } from 'antd';
import { Formik } from 'formik';
import { RemittanceTabProps } from './types';
import { useRemittanceTabContext } from './organization-hooks';
import { InputV2 } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { SelectInput } from '../Input/seletct-input';

export const PensionTab = (props: RemittanceTabProps) => {
  const { initialValues, handleSubmit } = useRemittanceTabContext(
    props,
    'pension',
  );

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
                <div className="info__remittance__form__top">
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

                  <div className="info__remittance__form__checkbox-cont">
                    <p className="info__remittance__form__hero-text">
                      Pension Type
                    </p>
                    <Radio.Group
                      name="pensionType"
                      value={values.pensionType}
                      onChange={handleChange}
                    >
                      <div className="info__remittance__form__checkbox">
                        <Radio value="deduct">Deduct</Radio>
                        <Radio value="quote">Quote</Radio>
                      </div>
                    </Radio.Group>
                  </div>
                </div>
                <div
                  className="info__remittance__input-cont"
                  style={{ justifyContent: 'flex-start', gap: '89px' }}
                >
                  <div>
                    <InputV2
                      label="Pension ID"
                      name="pensionId"
                      placeholder="Enter Pension ID"
                      error={touched.pensionId && errors.pensionId}
                      value={values.pensionId}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <SelectInput
                      label="Pension Fund Administrator"
                      name="pfa"
                      placeholder="Select PFA"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.pfa}
                      error={touched.pfa && errors.pfa}
                      options={props.organizationDetails.pfas}
                      displayValue="name"
                      actualValue="id"
                      showSearch="Search PFAs"
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
                  href="/organisations/remittance-employees?tab=pension"
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
