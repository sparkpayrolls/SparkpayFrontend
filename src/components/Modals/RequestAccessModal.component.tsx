import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Modal } from 'antd';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { HttpError } from 'src/api/repo/http.error';
import { RequestAccessValidation } from 'src/helpers/validation';
import { Button } from '../Button/Button.component';
import { InputV2 } from '../Input/Input.component';

export const RequestAccessModal = NiceModal.create(() => {
  const modal = useModal();

  return (
    <Modal
      title="Request Access"
      visible={modal.visible}
      onOk={modal.hide}
      onCancel={modal.hide}
      afterClose={modal.remove}
      className="JoinWaitListModal request-access-modal"
    >
      <Formik
        onSubmit={async (values, helpers) => {
          try {
            helpers.setSubmitting(true);
            await $api.auth.requestAccess(values);
            toast.success('Request submitted', {
              position: 'top-center',
            });
            modal.hide();
            setTimeout(modal.remove, 1000);
          } catch (error) {
            const err = error as HttpError;
            if (err.status === 422) {
              helpers.setErrors(err.errors);
              return;
            }

            toast.error(err.message, {
              position: 'top-center',
            });
          } finally {
            helpers.setSubmitting(false);
          }
        }}
        initialValues={{ name: '', email: '' }}
        validationSchema={RequestAccessValidation}
      >
        {(props) => {
          const {
            handleSubmit,
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          } = props;

          return (
            <form className="request-access-form" onSubmit={handleSubmit}>
              <InputV2
                label="Full Name"
                placeholder="Full Name"
                error={touched.name && errors.name}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                name="name"
              />

              <InputV2
                label="Email"
                placeholder="Email"
                type="email"
                error={touched.email && errors.email}
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
              />

              <Button
                type="submit"
                primary
                label="Request Access"
                showSpinner={isSubmitting}
                disabled={isSubmitting}
              />
            </form>
          );
        }}
      </Formik>
    </Modal>
  );
});
