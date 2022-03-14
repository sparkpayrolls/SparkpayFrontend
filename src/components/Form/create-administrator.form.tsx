import { Button } from '../Button/Button.component';
import { AutoComplete } from '../Input/autocomplete.component';
import { Select } from '../Input/select.component';

export const CreateAdministratorForm = () => {
  return (
    <form className="create-administrator-form">
      <AutoComplete label="Full Name" placeholder="Full Name" />
      <AutoComplete label="Email" placeholder="Email" />
      <Select
        label="Role"
        placeholder="Select Role"
        options={[{ value: 'some-id', label: 'Customer Care' }]}
      />
      <Button type="submit" label="Create Admin" primary />
    </form>
  );
};
