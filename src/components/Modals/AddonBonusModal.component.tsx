import React from 'react';
import NiceModal, { NiceModalHandler } from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Formik, FormikProps } from 'formik';
import { Input } from '../Input/Input.component';
import { Button } from '../Button/Button.component';
import { addonBonusValidationSchema } from 'src/helpers/validation';
import { AddonBonus } from '../types';
import { Select } from '../Input/select.component';
import { TextAreaAll } from '../Input/textarea.component';


export const AddonBonusModal = NiceModal.create(
  () => {
    return (
      <ModalLayout title="Create Addon Bonuses">
        {(modal) => {
          return (
            <AddonBonusForm
              modal={modal}
            />
          );
        }}
      </ModalLayout>
    );
  },
);


const AddonBonusForm = ({ modal }: { modal: NiceModalHandler }) => {

  const payrollCycle = [
    { id: 1, cycle: '1' },
    { id: 2, cycle: '2' },
  ];
  const addonFrequency = [
    { id: 1, frequency: 'interval' },
    { id: 2, frequency: 'recurring' },
  ];
  const addonType = [
    { id: 1, type: 'bonus' },
    { id: 2, type: 'deduction' },
  ];
  
  return (
    <Formik
      initialValues={{
        addonName: '',
        addonDescription: '',
        addonMonths: '',
        payrollCycle: '',
        amount: '',
        addontype: '',
        addonfrequency: ''
        
      }}
      validationSchema={addonBonusValidationSchema}
      onSubmit={(values) => {(modal)
        console.log(values);
      }}
    >
      {(props: FormikProps<AddonBonus>) => {
        const {
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
        } = props;
        return (
          <form
            onSubmit={handleSubmit}
            className="change-password-form"
            autoComplete="off"
          >
            <div className="change-password-form__section">
              <Input
                type="text"
                label="Addon Name"
                placeholder="name"
                name="name"
                value={values.addonName}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={errors.addonName && touched.addonName}
                error={errors.addonName}
              />
            </div>

            <div className="change-password-form__section">
              <TextAreaAll
                label="description"
                placeholder="Enter description"
                error={errors.addonDescription}
              />
            </div>

            <Select
              label="Payroll Cycle"
              error={(touched.payrollCycle && errors.payrollCycle) || ''}
            >
              {payrollCycle.map((cycle) => {
                const { Option } = Select;

                return (
                  <Option value={cycle.id} key={cycle.id}>
                    {cycle.cycle}
                  </Option>
                );
              })}
            </Select>
            <Select
              label="Addon Frequency"
              error={(touched.addonfrequency && errors.addonfrequency) || ''}
            >
              {addonFrequency.map((frequency) => {
                const { Option } = Select;

                return (
                  <Option value={frequency.id} key={frequency.id}>
                    {frequency.frequency}
                  </Option>
                );
              })}
            </Select>
            <Select
              label="Addon Type"
              error={(touched.addontype && errors.addontype) || ''}
            >
              {addonType.map((type) => {
                const { Option } = Select;

                return (
                  <Option value={type.id} key={type.id}>
                    {type.type}
                  </Option>
                );
              })}
            </Select>
            <div className="form__submit-button">
              <Button
                type="submit"
                label="Create Addon Bonus"
                className="form__submit-button form__submit-button--full-width"
                primary
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};



