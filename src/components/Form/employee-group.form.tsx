import { Button } from '../Button/Button.component';
import { InputV2, TextArea } from '../Input/Input.component';

export const EmployeeGroupForm = () => {
  return (
    <form className="employee-group-form">
      <InputV2
        placeholder="Group Name"
        label="Group Name"
        id="group_name"
        labelFor="group_name"
      />
      <TextArea
        labelFor="group_description"
        id="group_description"
        placeholder="Group Description"
        label="Group Description"
      />
      <InputV2
        placeholder="Common Salary (₦)"
        type="number"
        label="Common Salary (optional)"
        id="common_salary"
        labelFor="common_salary"
      />
      <Button label="Save Group" type="submit" primary />
    </form>
  );
};
