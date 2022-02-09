import { AutoComplete as A } from 'antd';
import classNames from 'classnames';
import { Container } from '../Shared/container.component';
import { IAutoComplete } from '../types';
import { Text } from '../Typography/Text';

export function AutoComplete(props: IAutoComplete) {
  const { label, error, className, ...autoCompleteProps } = props;
  let id: string | undefined;
  const autoCompleteClass = classNames('app-autocomplete', className, {
    [`has-error`]: !!error,
  });

  if (label) {
    id = label.toLowerCase().replace(/\s/gi, '_');
  }

  return (
    <Container className="app-autocomplete">
      {label && (
        <Text
          text={label}
          className="text__label"
          element="label"
          htmlFor={id}
        />
      )}
      <A id={id} {...autoCompleteProps} className={autoCompleteClass} />
      {error && (
        <Text
          className="input-v2--error__error text__sm text__danger"
          text={error}
        />
      )}
    </Container>
  );
}

AutoComplete.Option = A.Option;
