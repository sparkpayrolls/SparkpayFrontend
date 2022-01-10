import { AutoComplete as A } from 'antd';
import classNames from 'classnames';
import { InputError } from '../Shared/input-error.component';
import { Label } from '../Shared/label.component';
import { IAutoComplete } from '../types';





export function AutoComplete (props:IAutoComplete){
  const { label, error, className, ...autoCompleteProps} = props;
   let id: string | undefined;
  const autoCompleteClass = classNames('app-autocomplete', className, {
    [`has-error`]: !!error,
  });

  if (label) {
    id = label.toLowerCase().replace(/\s/gi, '_');
  }

  return (
    <div className="app-autocomplete">
      <Label htmlFor={id}>{label}</Label>
      <A id={id} {...autoCompleteProps} className={autoCompleteClass} />
      <InputError>{error}</InputError>
    </div>
  );
}

AutoComplete.Option = A.Option