import { useCallback, useState } from 'react';
import { $api } from 'src/api';
import { User } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { IAutoComplete } from '../types';
import { AutoComplete } from './autocomplete.component';

type IUserAutoComplete = IAutoComplete & {
  // eslint-disable-next-line no-unused-vars
  onSelect?(user: User): any;
};

export const UserAutoComplete = (props: IUserAutoComplete) => {
  const {
    loading: propLoading,
    onChange,
    onSelect,
    ...autoCompleteProps
  } = props;
  const [users, setUsers] = useState([] as User[]);
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getUsers = useCallback(
    Util.debounce(async (search: string) => {
      if (!search) return;
      try {
        setLoading(true);
        const { data } = await $api.user.getUsers({ search, limit: 5 });
        setUsers(data);
      } catch (error) {
        //....
      } finally {
        setLoading(false);
      }
    }, 500),
    [],
  );

  return (
    <AutoComplete
      {...autoCompleteProps}
      loading={propLoading || loading}
      onChange={(value, options) => {
        getUsers(value);
        if (onChange) {
          onChange(value, options);
        }
      }}
      options={users.map((user) => ({
        value: user.id,
        label: `${user.firstname} ${user.lastname}`,
      }))}
      onSelect={(value: string) => {
        const user = users.find((u) => u.id === value);
        if (user && onSelect) {
          onSelect(user);
        }
      }}
    />
  );
};
