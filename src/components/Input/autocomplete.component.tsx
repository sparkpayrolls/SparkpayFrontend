import { AutoComplete as A } from 'antd';
import classNames from 'classnames';
import { Container } from '../Shared/container.component';
import { Spinner } from '../Spinner/Spinner.component';
import { IAutoComplete } from '../types';
import { Text } from '../Typography/Text';

export function AutoComplete(props: IAutoComplete) {
  const { label, error, className, loading, ...autoCompleteProps } = props;
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
      <div className="app-autocomplete__input">
        <A id={id} {...autoCompleteProps} className={autoCompleteClass} />
        <div className="app-autocomplete__add-on">
          {loading && <Spinner color="--green" />}
        </div>
      </div>
      {error && (
        <Text className="input-v2--error__error text__text-sm text__danger">
          {error}
        </Text>
      )}
    </Container>
  );
}

AutoComplete.Option = A.Option;
