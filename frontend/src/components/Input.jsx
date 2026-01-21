import React, { useState } from 'react'

const Input = ({ 
  type = 'text', 
  className = '', 
  error = false, 
  success = false,
  icon = null,
  label = '',
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const getInputClasses = () => {
    let classes = 'input-field';
    
    if (error) classes += ' input-error';
    else if (success) classes += ' input-success';
    else if (isFocused) classes += ' input-focused';
    
    return `${classes} ${className}`;
  };

  return (
    <div className="input-wrapper">
      <input
        type={type}
        className={getInputClasses()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        {...props}
      />
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      {icon && (
        <div className="input-icon-wrapper">
          {icon}
        </div>
      )}
    </div>
  )
}

export default Input

