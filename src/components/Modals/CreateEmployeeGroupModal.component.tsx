import NiceModal from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { Input } from '../Input/Input.component';
import { Formik, FormikProps } from 'formik';
import { createEmployeeGroup } from '../types';
import { Button } from '../Button/Button.component';


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
               <div>
                 <p className="employee-details__group-description-text">Group description</p>
                 <textarea className='employee-details__group-text-area'>
                 </textarea>
               </div>
              
              <hr  className="employee-details__hr"/>
              <div className="form__submit-button employee-group-button">
                <Button
                  type="submit"
                  label="Save Group"
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
