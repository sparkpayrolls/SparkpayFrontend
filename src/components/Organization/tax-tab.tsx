import { Radio } from 'antd';
import { Formik } from 'formik';
import { useRemittanceTabContext } from './organization-hooks';
import { InputV2 } from '../Input/Input.component';
import { IF } from '../Misc/if.component';
import { Util } from 'src/helpers/util';
import { Button } from '../Button/Button.component';
import { RemittanceTabProps } from './types';

function TaxTab(props: RemittanceTabProps) {
  const {
    initialValues,
    taxStates,
    handleSubmit,
    handleManageTaxStates,
  } = useRemittanceTabContext(props);

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {(_props) => {
          const {
            values,
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

                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '.5rem',
                        alignItems: 'center',
                      }}
                    >
                      <p>{taxStates?.length ?? 0} tax states added</p>

                      <button
                        type="button"
                        style={{ color: '#1d4ed8' }}
                        className="text-[#1d4ed8]"
                        onClick={handleManageTaxStates(_props)}
                      >
                        manage
                      </button>
                    </div>
                  </div>

                  <div style={{ width: '100%', maxWidth: '312px' }}>
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
