import { Radio } from 'antd';
import { Formik } from 'formik';
import { useRemittanceTabContext } from './organization-hooks';
import { InputV2 } from '../Input/Input.component';
import { SelectInput } from '../Input/seletct-input';
import { IF } from '../Misc/if.component';
import { Util } from 'src/helpers/util';
import { Button } from '../Button/Button.component';
import { RemittanceTabProps } from './types';

function TaxTab(props: RemittanceTabProps) {
  const { initialValues, handleSubmit } = useRemittanceTabContext(props);

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
                      Tax Type
                    </p>
                    <Radio.Group
                      name="taxType"
                      value={values.taxType}
                      onChange={handleChange}
                    >
                      <div className="info__remittance__form__checkbox">
                        <Radio value="paye">Paye</Radio>
                        <Radio value="withholding">WithHolding</Radio>
                      </div>
                    </Radio.Group>
                  </div>
                </div>

                <div className="info__remittance__input-cont">
                  <div>
                    <InputV2
                      label="Tax Id"
                      name="taxId"
                      placeholder="Enter Tax ID"
                      error={errors.taxId}
                      value={values.taxId}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <IF condition={values.taxType === 'withholding'}>
                      <InputV2
                        placeholder="Enter Withholding Tax Rate"
                        type="number"
                        name="taxRate"
                        value={values.taxRate}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        label="Withholding Tax Rate %"
                      />
                    </IF>

                    <IF condition={values.taxType !== 'withholding'}>
                      <InputV2
                        placeholder="Enter health relief amount"
                        type="number"
                        name="healthRelief"
                        value={values.healthRelief}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        transformValue={Util.formatMoneyString('')}
                        label="Health Relief"
                      />
                    </IF>
                  </div>

                  <div>
                    <SelectInput
                      label="Tax state"
                      name="taxState"
                      placeholder="Select Tax State"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.taxState}
                      error={touched.taxState && errors.taxState}
                      options={props.organizationDetails.states}
                      displayValue="name"
                      actualValue="id"
                      showSearch="Search State"
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
                  href="/organisations/remittance-employees?tab=tax"
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
}

export default TaxTab;
