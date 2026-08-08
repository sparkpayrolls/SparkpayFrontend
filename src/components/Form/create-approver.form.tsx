import { useCreateApproverForm } from '../Administrator/administrator.hook';
import { Button } from '../Button/Button.component';
import { SelectInput } from '../Input/seletct-input';

export const CreateApproverForm = (
  props: Parameters<typeof useCreateApproverForm>[0],
) => {
  const {
    values,
    errors,
    touched,
    administrators,
    searchAdministrators,
    isSubmitting,
    buttonText,
    getDisplayValue,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useCreateApproverForm(props);

  return (
    <form onSubmit={handleSubmit} className="create-administrator-form">
      <SelectInput
        label="Administrator"
        placeholder="Select Administrator"
        name="id"
        value={values.id}
        onChange={handleChange}
        onBlur={handleBlur}
        options={administrators}
        actualValue="id"
        displayValue={getDisplayValue}
        error={touched.id && errors.id}
        onSearch={searchAdministrators}
        showSearch="Name or email to search"
      />

      <SelectInput
        label="Approver Index"
        placeholder="Select approver index"
        name="payrollApproverIndex"
        value={values.payrollApproverIndex?.toString()}
        onChange={handleChange}
        onBlur={handleBlur}
        options={[1, 2, 3, 4, 5].map((name) => ({ name: name.toString() }))}
        actualValue="name"
        displayValue="name"
        error={touched.payrollApproverIndex && errors.payrollApproverIndex}
      />

      <Button
        disabled={isSubmitting}
        showSpinner={isSubmitting}
        type="submit"
        label={buttonText}
        primary
      />
    </form>
  );
};
