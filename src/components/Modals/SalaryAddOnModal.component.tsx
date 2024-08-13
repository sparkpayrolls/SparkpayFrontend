import { useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { Button } from '../../components/Button/Button.component';
import { InputV2, TextArea } from '../../components/Input/Input.component';
import { SalaryValidation } from 'src/helpers/validation';
import { ModalLayout } from '../Modals/ModalLayout.component';
import { Select } from '../Input/select.component';
import NiceModal from '@ebay/nice-modal-react';
  import {
    SalaryAddonValidation,
  } from 'src/helpers/validation';
import { Addon } from 'src/api/types';
import { Util } from 'src/helpers/util';


  

export const SalaryAddOnModal = NiceModal.create((props: any) => {
  return (
    <ModalLayout title="Salary Add-Ons">
      {() => {
        return (
          <Formik
          onSubmit={{}}
          initialValues={{}}
          validationSchema={SalaryAddonValidation}
          >
            {(props) => {
              const {
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                setTouched,
                setValues,
              } = props;
              return (
                <form
                  onSubmit={handleSubmit}
                  className="edit-payroll-employee__form"
                >
                <p className='edit-payroll-employee__
                '>You can add allowance to your employee’s salary here</p>

                  <Select
                    label="Select Add-On"
                    placeholder="Choose the required add-on"
                    disabled={isSubmitting}
                    options={[
                      { value: 'bonus', label: 'Bonus' },
                      { value: 'prorate', label: 'Prorate' },
                      { value: 'deduction', label: 'Deduction' },
                    ]}
                  />
                  <TextArea
                    labelFor="group_description"
                    name="description"
                    id="group_description"
                    placeholder=" Add a description of the add-on"
                    label="Description"
                    // error={touched.description && errors.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                      // value={values.description}
                  />
                  <InputV2
                    label="Amount"
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    // value={values.amount}
                    // error={touched.amount && errors.amount}
                    // transformValue={Util.formatMoneyString(currency)}
                    // disabled={isSubmitting || loadingPayroll}
                  />
                  <p className='edit-payroll-employee__salarytext'>Add another add-on</p>
                  <div className='edit-payroll-employee__totaltext'>
                    <p>Total:</p>
                    <p>N1000</p>
                  </div>
                    <Button type="submit" label="Save Add-on" primary />
                </form>
              );
            }}
          </Formik>
        );
      }}
    </ModalLayout>
  );
});
