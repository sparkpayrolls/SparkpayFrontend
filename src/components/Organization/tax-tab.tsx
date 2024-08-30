import { Radio } from 'antd';
import { Formik, FormikProps } from 'formik';
import { TaxInfo } from '../types';
import { OrgInput } from './org-comp';
import React, { useState } from 'react';

type Errors = {
  id?: string;
  rate?: string;
  state?: string;
};
type FormValues = {
  id: string;
  rate: string;
  state: string;
};
type InfoProp = {
  viewEmployees: any;
};
function TaxTab(props: InfoProp) {
  const { viewEmployees } = props;
  // const [error, setError] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({});
  const [Fvalues, setFvalues] = useState<FormValues>({
    id: '',
    rate: '',
    state: '',
  });
  // const [taxId, setTaxId] = useState<string>('');
  const formatId = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const parts = cleaned.match(/.{1,3}/g);
    if (parts) {
      return parts.join('-');
    }
    return cleaned;
  };
  const FormatRate = (value: string) => {
    const cleaned = value.replace(/[^\d]/g, '');
    if (cleaned) {
      return `${cleaned}%`;
    }
    return '';
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'id') {
      const formattedId = formatId(value);
      setFvalues((prev) => ({ ...prev, [name]: formattedId }));
    } else if (name === 'rate') {
      const formattedRate = FormatRate(value);
      setFvalues((prev) => ({ ...prev, [name]: formattedRate }));
    } else {
      setFvalues((prev) => ({ ...prev, [name]: value }));
      validateForm();
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (Fvalues.id.length < 9) {
      newErrors.id = 'Incomplete tax id';
    }
    if (Fvalues.id.length > 11) {
      newErrors.id = 'Enter a valid id';
    }

    if (Fvalues.id.length === 11) {
      return;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  return (
    <>
      <Formik
        initialValues={{
          status: 'Remit',
          taxId: '',
          taxState: '',
          taxtRate: '',
          taxType: 'Paye',
        }}
        onSubmit={() => {}}
      >
        {(props: FormikProps<TaxInfo>) => {
          const {
            handleChange,
            handleSubmit,
            // isSubmitting,
            // handleBlur,
            values,
          } = props;
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
                        <Radio value="Paye">Paye</Radio>
                        <Radio value="WithHolding">WithHolding</Radio>
                      </div>
                    </Radio.Group>
                  </div>
                </div>
                <div className="info__remittance__input-cont">
                  <div>
                    <p className="info__remittance__form__hero-text">Tax Id</p>
                    <OrgInput
                      name="id"
                      placeholder="Enter tax id"
                      min={9}
                      error={errors.id}
                      value={Fvalues.id}
                      onChange={handleInputChange}
                      maxLength={11}
                    />
                  </div>
                  <div>
                    <p className="info__remittance__form__hero-text">Rate %</p>
                    <OrgInput
                      placeholder="Enter rate"
                      type="number"
                      value={Fvalues.rate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <p className="info__remittance__form__hero-text">
                      Tax state
                    </p>
                    <OrgInput
                      placeholder="Enter tax state"
                      error={errors.state}
                      value={Fvalues.state}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="info__remittance__form__action">
                <button className="info__remittance__form__save-btn">
                  Save Changes
                </button>
                <button
                  onClick={() => viewEmployees(true)}
                  className="info__remittance__form__view-btn"
                >
                  View Employees
                </button>
              </div>
            </form>
          );
        }}
      </Formik>
    </>
  );
}

export default TaxTab;
