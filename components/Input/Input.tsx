import React from "react";

interface InputProps {
  /**
   * Input Placeholder contents
   */
  placeholder?: string;
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

  /**
   * custom class name
   */
  className?: string;
}

/**
 * Input UI component for user interaction
 */
export const Input = ({
  label,
  placeholder,
  type = "text",
  name,
  className,
  ...props
}: InputProps) => {
  return (
    <div className={["input-container", `${className}`].join(" ")}>
      <label htmlFor={name} className="input-label">
        {label}
      </label>
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
