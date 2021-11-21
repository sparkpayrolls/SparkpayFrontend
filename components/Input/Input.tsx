import React from "react";
import "./input.scss";

interface InputProps {
  /**
   * Input Placeholder contents
   */
  placeholder: string;
  /**
   * How large should the button be?
   */
  type: "text" | "email" | "password";
  /**
   * Input label content
   */
  label: string;

  /**
   * label htmlFor & input name
   */
  name: string;
}

/**
 * Input UI component for user interaction
 */
export const Input = ({
  label,
  placeholder,
  type = "text",
  name,
  ...props
}: InputProps) => {
  return (
    <div className="input-container">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        className="input"
        placeholder={placeholder}
        name={name}
        {...props}
      />
    </div>
  );
};
