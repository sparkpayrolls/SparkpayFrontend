import { AutoComplete } from '../src/components/Input/autocomplete.component';
import { useState } from 'react';

const Option = AutoComplete.Option;

const AutoCompleteTest = () =>{
      const [result, setResult] = useState<string[]>([]);
  const handleSearch = (value: string) => {
    let res: string[] = [];
    if (!value || value.indexOf('@') >= 0) {
      res = [];
    } else {
      res = ['gmail.com', '163.com', 'qq.com'].map(domain => `${value}@${domain}`);
    }
    setResult(res);
  };
  return (
    <AutoComplete onSearch={handleSearch} placeholder="input here" label="Email" error="Enter your correct email">
      {result.map((email: string) => (
        <Option key={email} value={email}>
          {email}
        </Option>
      ))}
    </AutoComplete>
  );
}

export default AutoCompleteTest