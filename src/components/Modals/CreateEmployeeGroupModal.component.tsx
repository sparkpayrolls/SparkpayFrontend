import NiceModal from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Input } from '../Input/Input.component';
import { Formik, FormikProps } from 'formik';
import { createEmployeeGroup } from '../types';
import { Button } from '../Button/Button.component';
import {  Plus2Svg } from '@/components/svg';

export const CreateEmployeeGroupModal = NiceModal.create(() => {
  return (
    <ModalLayout title="Create Employee Group">
      {() => {
        return <CreateEmployeeGroupForm />;
      }}
    </ModalLayout>
  );
});

const CreateEmployeeGroupForm = () => {
  return (
    <>
      <Formik
        initialValues={{
          name: '',
          salary: '',
          bonusname: '',
          bonus: '',
          payrollcount: '',
        }}
        onSubmit={(...args) => {
          console.log(args);
        }}
      >
        {(props: FormikProps<createEmployeeGroup>) => {
          const { handleChange, handleSubmit } = props;

          return (
            <form
              onSubmit={handleSubmit}
              className="single-employee-upload-form"
              autoComplete="off"
            >
              <div className="single-employee-upload-form__section fund-wallet-modal__fund-amount">
                <Input
                  type="text"
                  label=" Group Name"
                  placeholder="Group Name"
                  name="salary"
                  onChange={handleChange}
                />
              </div>

              <div className="single-employee-upload-form__section fund-wallet-modal__fund-amount">
                <Input
                  type="text"
                  label="Common Salary Amount (₦) "
                  placeholder="N50,000"
                  name="salary"
                  onChange={handleChange}
                />
              </div>

              <div className="single-employee-upload-form__section fund-wallet-modal__fund-amount">
                <Input
                  type="text"
                  label="Bonus Name"
                  placeholder="Staff of the month"
                  name="Bonus Name"
                  onChange={handleChange}
                />
              </div>

              <div className="single-employee-upload-form__section fund-wallet-modal__fund-amount">
                <Input
                  type="text"
                  label="Bonus Name"
                  placeholder="Staff of the month"
                  name="Bonus Name"
                  onChange={handleChange}
                />
              </div>
                <div className="form__grid single-employee-upload-form__section">
              <div className="form__grid__col--6 padding-right-space-1">
                <Input
                  type="text"
                  label="Bonus (₦) "
                  placeholder="₦ 10,000"
                  name="Bonus (₦)"
                  onChange={handleChange}
                 
                />
              </div>

              <div className="form__grid__col--6 padding-left-space-1">
                <Input
                  type="text"
                  label="Payroll Count"
                  placeholder="1"
                  name="Payroll Count"
                  onChange={handleChange}
                 
                />
              </div>
            </div>
             <div> 
        <span>
          <Plus2Svg /> 
        </span>       
         <p>Add Bonus</p>
      </div>
              <div className="form__submit-button">
                <Button
                  type="submit"
                  label="submit"
                  className="form__submit-button form__submit-button--full-width reset-button"
                  primary
                />
              </div>
            </form>
          );
        }}
      </Formik>
     
    </>
  );
};

export default CreateEmployeeGroupForm;
