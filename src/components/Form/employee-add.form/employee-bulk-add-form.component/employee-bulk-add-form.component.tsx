import { Button } from '@/components/Button/Button.component';
import { Select } from '@/components/Input/select.component';
import { IF } from '@/components/Misc/if.component';
import { InputError } from '@/components/Shared/input-error.component';
import { AddFileSVG } from '@/components/svg';
import { Formik } from 'formik';
import { Util } from 'src/helpers/util';
import { bulkEmployeeFileUploadValidationSchema } from 'src/helpers/validation';
import { useEmployeeBulAddFormContext } from './hooks';
import { EmployeeBulkAddFormProps } from './types';

export const EmployeeBulkAddForm = (props: EmployeeBulkAddFormProps) => {
  const {
    fileUploadClass,
    getDownloadClickHandler,
    getFileUploadHandler,
    handleFormikSubmit,
    initialValues,
    loadingPayoutMethods,
    payoutMethods,
    setUploadTextActive,
  } = useEmployeeBulAddFormContext(props);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={bulkEmployeeFileUploadValidationSchema}
      onSubmit={handleFormikSubmit}
    >
      {(props) => {
        const {
          handleSubmit,
          isSubmitting,
          setValues,
          setTouched,
          setErrors,
          touched,
          errors,
          values,
        } = props;

        return (
          <form
            onSubmit={handleSubmit}
            className="edit-details-form"
            autoComplete="off"
          >
            <Select
              label="Payout Method"
              style={{ marginBottom: '1.5rem' }}
              placeholder="Select Payout Method"
              onBlur={Util.getCustomBlurHandler({
                touched,
                setTouched,
                name: 'payoutMethod',
              })}
              defaultValue={values.payoutMethod}
              onChange={Util.getCustomChangeHandler<typeof values, string>({
                values,
                setValues,
                name: 'payoutMethod',
              })}
              options={payoutMethods}
              disabled={loadingPayoutMethods}
              loading={loadingPayoutMethods}
              error={touched.payoutMethod && errors.payoutMethod}
            />
            <IF condition={values.payoutMethod}>
              <label>
                <div
                  className={fileUploadClass}
                  draggable
                  onDragOver={() => setUploadTextActive(true)}
                  onDragLeave={() => setUploadTextActive(false)}
                >
                  <AddFileSVG />
                  <p className="form__file-upload--text">
                    <IF condition={values.fileName}>{values.fileName}</IF>
                    <IF condition={!values.fileName}>
                      <span className="form__file-upload-text--highlight">
                        Upload a file
                      </span>{' '}
                      or drag and drop
                    </IF>
                  </p>

                  <span className="form__file-upload-subtext">
                    <IF condition={values.file}>Change File</IF>
                    <IF condition={!values.file}>
                      Spreadsheet (xlsx) up to 10MB
                    </IF>
                  </span>
                  <input
                    type="file"
                    name="xlslFile"
                    accept=".xlsx"
                    onChange={getFileUploadHandler({
                      setTouched,
                      setValues,
                      setErrors,
                      values,
                    })}
                  />
                </div>
                <InputError>{touched.file && errors.file}</InputError>
              </label>

              <button
                onClick={getDownloadClickHandler(values.payoutMethod)}
                className="form__sample-btn"
              >
                Download Format
              </button>
            </IF>

            <div className="form__submit-button">
              <Button
                type="submit"
                label="Proceed"
                className="form__submit-button form__submit-button--full-width"
                primary
                disabled={isSubmitting}
                showSpinner={isSubmitting}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
