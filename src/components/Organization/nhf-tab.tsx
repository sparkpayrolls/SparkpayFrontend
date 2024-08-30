import { Radio } from 'antd';
import { Formik, FormikProps } from 'formik';
import { OrgInput } from './org-comp';
import React, { useState } from 'react';
import { NhfInfo } from '../types';
import Link from 'next/link';

type Errors = {
  id?: string;
  rate?: string;
  state?: string;
};

export const NhfTab = () => {
  const [errors, setErrors] = useState<Errors>({});
  const [Fvalues, setFvalues] = useState<NhfInfo>({
    status: '',
    NhfId: '',
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'id') {
      const formattedId = formatId(value);
      setFvalues((prev) => ({ ...prev, [name]: formattedId }));
    } else {
      setFvalues((prev) => ({ ...prev, [name]: value }));
      validateForm();
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    if (Fvalues.NhfId.length < 11) {
      newErrors.id = 'Incomplete tax id';
    }
    if (Fvalues.NhfId.length > 11) {
      newErrors.id = 'Enter a valid id';
    }

    if (Fvalues.NhfId.length == 11) {
      newErrors.id = 'raxoo';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  return (
    <>
      <Formik
        initialValues={{
          status: 'Remit',
          NhfId: '',
        }}
        onSubmit={() => {}}
      >
        {(props: FormikProps<NhfInfo>) => {
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
                    <p className="info__remittance__form__hero-text">NHF ID</p>
                    <OrgInput
                      name="id"
                      placeholder="XXX-XXX-XXX"
                      min={9}
                      error={errors.id}
                      value={Fvalues.NhfId}
                      onChange={handleInputChange}
                      maxLength={11}
                    />
                  </div>
                </div>
              </div>
              <div className="info__remittance__form__action">
                <button className="info__remittance__form__save-btn">
                  Save Changes
                </button>
                <Link href="/organisations/view_employees">
                  <a className="info__remittance__form__view-btn">
                    View Employees
                  </a>
                </Link>
              </div>
            </form>
          );
        }}
      </Formik>
    </>
  );
};
