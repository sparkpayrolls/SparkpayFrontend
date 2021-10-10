import { DetailedHTMLProps, SelectHTMLAttributes } from 'react';

type SelectOption = {
  value: string;
  text: string;
  id: string;
};

type SelectInputProps = {
  options: SelectOption[];
  error?: string;
  hasError?: boolean;
} & DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;

export const SelectInput = ({
  options,
  error,
  hasError,
  ...props
}: SelectInputProps) => {
  return (
    <>
      <select {...props}>
        <option value="">{props.placeholder}</option>
        {options.map((option) => {
          return (
            <option key={option.id} value={option.value}>
              {option.text}
            </option>
          );
        })}
      </select>
      {hasError && <span>{error}</span>}
    </>
  );
};
