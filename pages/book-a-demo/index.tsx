import { Button } from '@/components/Button/Button.component';
import { InputV2 } from '@/components/Input/Input.component';
import { SelectInput } from '@/components/Input/seletct-input';
import { Formik } from 'formik';
import { useBookDemoPageContext } from 'src/helpers/hooks/use-book-demo-page-context.hook';
import { bookDemoValidationSchema } from 'src/helpers/validation';
import { AuthLayout } from 'src/layouts/auth-layout/auth-layout';

export default function BookADemo() {
  const context = useBookDemoPageContext();
  if (!context) {
    return null;
  }

  return (
    <AuthLayout title="SparkPay | Book a Demo">
      <h1 className="create-account__title">Book a Demo</h1>
      <p className="create-account__subtext">
        Enter your info and we&apos;ll be in touch.
      </p>

      <Formik
        initialValues={context.initialValues}
        onSubmit={context.handleSubmit}
        validationSchema={bookDemoValidationSchema}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <div className="create-account__form-input-area">
                <div className="create-account__form-grid">
                  <InputV2
                    type="text"
                    label="First Name"
                    name="firstname"
                    value={values.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstname && errors.firstname}
                  />

                  <InputV2
                    type="text"
                    label="Last Name"
                    name="lastname"
                    value={values.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastname && errors.lastname}
                  />
                </div>

                <InputV2
                  type="email"
                  label="Email Address"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && errors.email}
                />

                <InputV2
                  type="tel"
                  label="Phone Number"
                  name="phonenumber"
                  value={values.phonenumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.phonenumber && errors.phonenumber}
                />

                <InputV2
                  type="text"
                  label="Company Name"
                  name="company"
                  value={values.company}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.company && errors.company}
                />

                <SelectInput
                  label="Employee Size"
                  name="employeeSize"
                  placeholder="Select Employee Size"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.employeeSize}
                  error={touched.employeeSize && errors.employeeSize}
                  options={['0 - 10', '11 - 50', '51 and above']}
                />
              </div>

              <Button
                type="submit"
                label="Book Demo"
                className="create-account__submit-btn"
                primary
                disabled={isSubmitting}
                showSpinner={isSubmitting}
              />
            </form>
          );
        }}
      </Formik>
    </AuthLayout>
  );
}
