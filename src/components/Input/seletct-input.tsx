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
        {options.map((option) => {
          return (
            <>
              <option key="unique-key-prop" value="">
                {props.placeholder}
              </option>
              <option key={option.id} value={option.value}>
                {option.text}
              </option>
            </>
          );
        })}
      </select>
      {hasError && <span>{error}</span>}
    </>
  );
};
